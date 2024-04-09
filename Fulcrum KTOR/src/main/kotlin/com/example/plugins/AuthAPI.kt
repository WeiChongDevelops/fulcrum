package com.example.plugins

import com.example.*
import com.example.SupabaseClient.supabase
import com.example.entities.budget.*
import com.example.entities.user.*
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.postgrest.postgrest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.lang.IllegalStateException

fun Application.configureAuthRouting() {

    routing {

        post("/api/register") {
            try {
                val userCreds = call.receive<UserCredentials>()
                supabase.gotrue.signUpWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }

                val uid = getActiveUserId()

                // Default Public User Data Initialisation
                val newUserInfo = PublicUserDataCreateRequestSent(
                    userId = uid
                )
                val userInfoInserted = supabase.postgrest["public_user_data"].insert(
                    newUserInfo
                )
                if (userInfoInserted.body == null) {
                    call.respondError("Default public user data initialisation failed.")
                }

                // Default Budget Groups Initialisation
                val defaultGroups = getDefaultGroups(uid)
                val defaultGroupsInserted = supabase.postgrest["groups"].insert(defaultGroups)
                if (defaultGroupsInserted.body == null) {
                    call.respondError("Default group creation failed.")
                }

                // Default Categories Initialised
                val defaultCategories = getDefaultCategories(uid)
                val defaultCategoriesInserted = supabase.postgrest["budgets"].insert(defaultCategories)
                if (defaultCategoriesInserted.body == null) {
                    call.respondError("Default category creation failed.")
                }

                // Total Income Initialisation
                val initialisedTotalIncome = IncomeCreateRequestSent(
                    userId = uid,
                    totalIncome = 10000.00
                )
                val initialisedTotalIncomeInserted = supabase.postgrest["total_income"].insert(
                    initialisedTotalIncome
                )
                if (initialisedTotalIncomeInserted.body == null) {
                    call.respondError("Default total income initialisation failed.")
                }

                call.respondSuccess("User added successfully with all defaults.")
            } catch (e: Exception) {
                call.respondError("Error while registering new user.")
            }
        }

        post("/api/login") {
            val userCreds = call.receive<UserCredentials>()
            val currentUser = supabase.gotrue.currentSessionOrNull()
            if (currentUser == null) {
                supabase.gotrue.loginWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }
                supabase.gotrue.refreshCurrentSession()
                val loggedInUser = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                call.respond(HttpStatusCode.OK, loggedInUser)
            } else {
                call.respondSuccess("User already logged in.")
            }
        }

        post("/api/logout") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                if (currentUser != null) {
                    supabase.gotrue.logout()
                    call.respondSuccess("Logged out ${currentUser.user?.email!!}.")
                } else {
                    call.respondSuccess("No user logged in.")
                }
            } catch (e: UnauthorizedRestException) {
                supabase.gotrue.logout()
                call.respondSuccess("Logout processed with expired JWT.")
            } catch (e: Exception) {
                application.log.error("Error while logging user out.", e)
                call.respondError("Error while logging user out: $e.")
            }
        }
//
//        get("/api/getUserEmailIfLoggedIn") {
//            try {
//                val currentUser = supabase.gotrue.currentSessionOrNull()
//                if (currentUser != null) {
//                    call.respond(HttpStatusCode.OK, UserEmail(email = currentUser.user?.email!!))
//                } else {
//                    call.respondSuccess("Check found no user currently logged in.")
//                }
//            } catch (e: Exception) {
//                call.respondError("Error while checking for user.")
//            }
//        }
//
//        get("/api/checkForUser") {
//            try {
//                val currentUser = supabase.gotrue.currentSessionOrNull()
//                val statusJSON = if (currentUser == null) {
//                    UserStatusCheck(loggedIn = false)
//                } else {
//                    UserStatusCheck(loggedIn = true)
//                }
//                call.respond(HttpStatusCode.OK, statusJSON)
//            } catch (e: UnauthorizedRestException) {
//                call.respondAuthError("Not authorised - JWT token likely expired.")
//            } catch (e: IllegalStateException) {
//                call.respondAuthError("Session not found.")
//            } catch (e: Exception) {
//                call.respondError("Error while checking for user.")
//            }
//        }

        get("/api/getActiveUserEmailOrNull") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                val userStatus = if (currentUser == null) {
                    UserEmailOrNull(email = null)
                } else {
                    UserEmailOrNull(email = currentUser.user?.email!!)
                }
                call.respond(HttpStatusCode.OK, userStatus)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while checking for user.", e)
                call.respondError("Error while checking for user: $e")
            }
        }
    }
}