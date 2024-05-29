package com.example.plugins

import com.example.*
import com.example.SupabaseClient.supabase
import com.example.entities.budget.*
import com.example.entities.user.*
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.providers.Facebook
import io.github.jan.supabase.gotrue.providers.Google
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.gotrue.user.UserSession
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*


fun Application.configureAuthRouting() {

    routing {

        suspend fun initialiseDefaultUserPreferences(call: ApplicationCall) {
            val uid = getActiveUserId()

            if (supabase.postgrest["user_preferences"].select(
                    columns = Columns.list("currency, createdAt, darkModeEnabled, accessibilityEnabled, profileIconFileName")
                ) {
                    eq("userId", uid)
                }.decodeSingleOrNull<UserPreferencesResponse>() != null
            ) {
                supabase.postgrest["user_preferences"].delete() {
                    eq("userId", uid)
                }
            }

            val newUserInfo = UserPreferencesCreateRequestSent(
                userId = uid
            )
            val userInfoInserted = supabase.postgrest["user_preferences"].insert(
                newUserInfo, upsert = true
            )
            if (userInfoInserted.body == null) {
                call.respondError("Default user preferences initialisation failed.")
            }
        }

        suspend fun initialiseDefaultIncome(call: ApplicationCall) {
            val initialisedTotalIncome = IncomeCreateRequestSent(
                userId = getActiveUserId(),
                totalIncome = 10000.00
            )
            val initialisedTotalIncomeInserted = supabase.postgrest["total_income"].insert(
                initialisedTotalIncome, upsert = true
            )
            if (initialisedTotalIncomeInserted.body == null) {
                call.respondError("Default total income initialisation failed.")
            }
        }

        suspend fun initialiseDefaultBudgets(call: ApplicationCall, miscellaneousExists: Boolean) {
            val uid = getActiveUserId()

            val defaultGroups = getDefaultGroups(uid, miscellaneousExists)
            val defaultGroupsInserted = supabase.postgrest["groups"].insert(defaultGroups)
            if (defaultGroupsInserted.body == null) {
                call.respondError("Default group creation failed.")
            }

            val defaultCategories = getDefaultCategories(uid)
            val defaultCategoriesInserted = supabase.postgrest["budgets"].insert(defaultCategories)
            if (defaultCategoriesInserted.body == null) {
                call.respondError("Default category creation failed.")
            }
        }

        post("/api/register") {
            try {
                val userCreds = call.receive<UserCredentials>()
                supabase.gotrue.signUpWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }
                val miscGroup =
                    supabase.postgrest["groups"].select(columns = Columns.list("group, colour, timestamp, id")) {
                        eq("group", "Miscellaneous")
                    }.decodeSingleOrNull<GroupItemResponse>()
                initialiseDefaultUserPreferences(call)
                initialiseDefaultIncome(call)
                initialiseDefaultBudgets(call, miscGroup != null)
                supabase.gotrue.logout()

                call.respondSuccess("User added successfully with all defaults.")
            } catch (e: Exception) {
                application.log.error("Error while registering new user.", e)
                call.respondError("Error while registering new user.")
            }
        }

        post("/api/login") {
            try {
                val userCreds = call.receive<UserCredentials>()
                supabase.gotrue.currentSessionOrNull()
                supabase.gotrue.loginWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }
                supabase.gotrue.refreshCurrentSession()
//                    val loggedInUser = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                val jwt = supabase.gotrue.currentSessionOrNull()!!.accessToken;
                call.respond(HttpStatusCode.OK, jwt)
            } catch (e: Exception) {
                call.respondError("Credentials incorrect.")
            }
        }

        post("/api/oAuthLoginPrompt") {
            try {
                val oAuthLoginPromptRequestReceived = call.receive<OAuthLoginPromptRequestReceived>()
                val provider = if (oAuthLoginPromptRequestReceived.provider == "facebook") {
                    Facebook
                } else if (oAuthLoginPromptRequestReceived.provider == "google") {
                    Google
                } else {
                    null
                }

                if (provider == Facebook) {
                    call.respond(HttpStatusCode.OK, "https://fulcrumfinance.app/whatintheworldwereyouthinkingmark")
                }

                if (provider == null) {
                    throw IllegalArgumentException("Invalid OAuth provider requested.")
                } else {
                    val oAuthLoginURL =
                        supabase.gotrue.oAuthUrl(
                            provider,
                            redirectUrl = "https://fulcrumfinance.app/oAuthSuccess"
                        )
                    call.respond(HttpStatusCode.OK, oAuthLoginURL)
                }

            } catch (e: Exception) {
                application.log.error("Error during OAuth prompt.", e)
                call.respondError("Error during OAuth prompt: $e")
            }
        }

        post("/api/oAuthLoginAttempt") {
            try {
                val oAuthLoginAttemptRequest = call.receive<OAuthLoginAttemptRequest>()

                val accessToken = oAuthLoginAttemptRequest.accessToken
                val refreshToken = oAuthLoginAttemptRequest.refreshToken

                supabase.gotrue.importSession(
                    UserSession(
                        accessToken = accessToken,
                        refreshToken = refreshToken,
                        expiresIn = 3600,
                        tokenType = "bearer",
                        user = null
                    ),
                    true
                )
                supabase.gotrue.refreshCurrentSession()
                val loggedInUser = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                call.respond(HttpStatusCode.OK, loggedInUser)
            } catch (e: Exception) {
                application.log.error("Error during OAuth login attempt.", e)
                call.respondError("Error during OAuth login attempt: $e")
            }
        }

        post("/api/oAuthDataInitialisation") {
            try {
                val userPreferencesNotFound = supabase.postgrest["user_preferences"].select(
                    columns = Columns.list(
                        "createdAt, currency, darkModeEnabled, accessibilityEnabled, profileIconFileName"
                    )
                ).decodeSingleOrNull<UserPreferencesResponse>() == null
                val totalIncomeNotFound =
                    supabase.postgrest["total_income"].select(columns = Columns.list("totalIncome"))
                        .decodeSingleOrNull<TotalIncomeResponse>() == null

                if (userPreferencesNotFound) {
                    initialiseDefaultUserPreferences(call)
                }

                if (totalIncomeNotFound) {
                    initialiseDefaultIncome(call)
                }

                if (userPreferencesNotFound && totalIncomeNotFound) {
                    initialiseDefaultBudgets(call, false)
                }

                call.respondSuccess("OAuth init successful.")
            } catch (e: Exception) {
                application.log.error("Error during OAuth data init.", e)
                call.respondError("Error during OAuth data init: $e")
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

        get("/api/getActiveUserEmailOrNull") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                val userStatus = if (currentUser == null) {
                    UserEmailOrNull(email = null)
                } else {
                    UserEmailOrNull(email = currentUser.user?.email)
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

        post("/api/resetAccountData") {
            try {
                initialiseDefaultBudgets(call, true)
                initialiseDefaultUserPreferences(call)
                initialiseDefaultIncome(call)
                call.respondSuccess("Successfully reset account.")
            } catch (e: Exception) {
                call.application.log.error("Error while resetting account.", e)
                call.respondError("Error while resetting account: $e")
            }
        }
    }
}