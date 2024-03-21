package com.example.plugins

import com.example.SupabaseClient.supabase
import com.example.entities.budget.*
import com.example.entities.expense.*
import com.example.entities.recurringExpense.*
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import com.example.entities.user.*
import com.example.getActiveUserId
import com.example.respondAuthError
import com.example.respondError
import com.example.respondSuccess
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.client.*
import io.ktor.client.engine.apache5.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.apache.hc.core5.http.HttpHost
import kotlinx.datetime.Instant
import java.lang.IllegalStateException

fun Application.configureAuthRouting() {


    routing {

        post("/api/register") {
            try {
                val userCreds = call.receive<UserInfo>()
                val user = supabase.gotrue.signUpWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }

                val uid = getActiveUserId()

                val newUserInfo = PublicUserDataCreateRequestSent (
                    userId = uid
                )

                val userInfoInserted = supabase.postgrest["public_user_data"].insert(
                    newUserInfo
                )

                if (userInfoInserted.body == null) {
                    call.respondError("New row not added to public user data.")
                }

                // Default Budget Groups Initialised

                val defaultGroups = listOf(
                    GroupCreateRequestSent(userId = uid, group = "Savings", colour = "#9fd5be"),
                    GroupCreateRequestSent(userId = uid, group = "Miscellaneous", colour = "#3f4240"),
                    GroupCreateRequestSent(userId = uid, group = "Food & Drink", colour = "#f1afa1"),
                    GroupCreateRequestSent(userId = uid, group = "Housing", colour = "#7c86bf"),
                    GroupCreateRequestSent(userId = uid, group = "Transport", colour = "#dfcde3")
                )

                val defaultGroupsInserted = supabase.postgrest["groups"].insert(defaultGroups)

                if (defaultGroupsInserted.body == null) {
                    call.respondError("Default groups not added.")
                }

                // Default Categories Initialised

                val defaultCategories = listOf(
                    BudgetCreateRequestSent(userId = uid, category = "Other", amount = 0.00, iconPath = "category-default-icon.svg", group = "Miscellaneous"),
                    BudgetCreateRequestSent(userId = uid, category = "Emergency Funds", amount = 0.00, iconPath = "category-emergency-icon.svg", group = "Savings"),
                    BudgetCreateRequestSent(userId = uid, category = "Drinks", amount = 0.00, iconPath = "category-beer-icon.svg", group = "Food & Drink"),
                    BudgetCreateRequestSent(userId = uid, category = "Groceries", amount = 0.00, iconPath = "category-cart-icon.svg", group = "Food & Drink"),
                    BudgetCreateRequestSent(userId = uid, category = "Restaurant", amount = 0.00, iconPath = "category-utencils-icon.svg", group = "Food & Drink"),
                    BudgetCreateRequestSent(userId = uid, category = "Rent", amount = 0.00, iconPath = "category-house-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Water", amount = 0.00, iconPath = "category-water-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Electricity", amount = 0.00, iconPath = "category-electricity-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Internet", amount = 0.00, iconPath = "category-wifi-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Petrol", amount = 0.00, iconPath = "category-petrol-icon.svg", group = "Transport"),
                    BudgetCreateRequestSent(userId = uid, category = "Parking", amount = 0.00, iconPath = "category-car-icon.svg", group = "Transport"),
                    BudgetCreateRequestSent(userId = uid, category = "Public Transport", amount = 0.00, iconPath = "category-train-icon.svg", group = "Transport")
                )

                val defaultCategoriesInserted = supabase.postgrest["budgets"].insert(defaultCategories)

                if (defaultCategoriesInserted.body == null) {
                    call.respondError("Default categories not added.")
                }

                // Total Income Initialised
                val initialisedTotalIncome = IncomeCreateRequestSent(
                    userId = uid,
                    totalIncome = 8000.00
                )
                val initialisedTotalIncomeInserted = supabase.postgrest["total_income"].insert(
                    initialisedTotalIncome
                )
                if (initialisedTotalIncomeInserted.body == null) {
                    call.respondError("Default total income not inserted.")
                }

                call.respondSuccess("User added successfully.")
            } catch (e: Exception) {
                call.respondError("User not added.")
            }
        }

        post("/api/login") {
            val userCreds = call.receive<UserInfo>()
            val currentUser = supabase.gotrue.currentSessionOrNull()
            if (currentUser == null) {
                val user = supabase.gotrue.loginWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }
                supabase.gotrue.refreshCurrentSession()
                val loggedInUser = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                call.respond(HttpStatusCode.OK, loggedInUser)
            } else {
                call.respondError("User already logged in.")
            }
        }

        post("/api/logout") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                if (currentUser != null) {
                    supabase.gotrue.logout()
                    call.respondSuccess(currentUser.user?.email!!)
                } else {
                    call.respondError("No user logged in.")
                }
            } catch (e: UnauthorizedRestException) {
                supabase.gotrue.logout()
                call.respondSuccess("Logout processed with expired JWT.")
            }
        }

        get("/api/getUserEmailIfLoggedIn") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                if (currentUser != null) {
                    call.respond(HttpStatusCode.OK, UserEmail(email = currentUser.user?.email!!))
                } else {
                    call.respondSuccess("No user logged in.")
                }
            } catch (e: Exception) {
                call.respondError("Error while checking for user.")
            }
        }

        get("/api/checkForUser") {
            val currentUser = supabase.gotrue.currentSessionOrNull()
            try {
                val statusJSON = if (currentUser == null) {
                    UserStatusCheck(loggedIn = false)
                } else {
                    UserStatusCheck(loggedIn = true)
                }
                call.respond(HttpStatusCode.OK, statusJSON)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.respondError("Error while checking for user.")
            }
        }
    }
}