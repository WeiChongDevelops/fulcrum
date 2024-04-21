package com.example.plugins

import com.example.*
import com.example.SupabaseClient.supabase
import com.example.entities.budget.*
import com.example.entities.user.*
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.parseSessionFromUrl
import io.github.jan.supabase.gotrue.providers.Facebook
import io.github.jan.supabase.gotrue.providers.Google
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.gotrue.providers.builtin.IDToken
import io.github.jan.supabase.gotrue.user.UserSession
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable


fun Application.configureAuthRouting() {

    routing {

        suspend fun initialiseDefaultPublicUserData(call: ApplicationCall) {
            val uid = getActiveUserId()

            val newUserInfo = PublicUserDataCreateRequestSent(
                userId = uid
            )
            val userInfoInserted = supabase.postgrest["public_user_data"].insert(
                newUserInfo
            )
            if (userInfoInserted.body == null) {
                call.respondError("Default public user data initialisation failed.")
            }
        }

        suspend fun initialiseDefaultIncome(call: ApplicationCall) {
            val uid = getActiveUserId()

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
                    supabase.postgrest["groups"].select(columns = Columns.list("group, colour, timestamp")) {
                        eq("group", "Miscellaneous")
                    }.decodeSingleOrNull<GroupItemResponse>()
                initialiseDefaultPublicUserData(call)
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
            } catch (e: Exception) {
                call.respondError("Credentials incorrect.")
            }
        }

        post("/api/oAuthLoginPrompt") {
            try {
                val oAuthLoginPromptRequestReceived = call.receive<OAuthLoginPromptRequestReceived>()
                val provider = if (oAuthLoginPromptRequestReceived.provider == "facebook") {
                    Facebook
                } else {
                    Google
                }

                supabase.gotrue.loginWith(provider, redirectUrl = "http://localhost:5173/oAuthSuccess") {
                    scopes.add("email")
                }

//                supabase.gotrue.signUpWith()

//                val url = supabase.gotrue.oAuthUrl(
//                    provider = Google,
//                    redirectUrl = "http://localhost:5173/oAuthSuccess",
//                ) {
//                    scopes.addAll(listOf("openid", "email"))
////                    queryParams["redirect_uri"] = "http://localhost:5173/oAuthSuccess"
//                    queryParams["response_type"] = "code"
//                    queryParams["nonce"] = java.util.UUID.randomUUID().toString()
//                    queryParams["state"] = java.util.UUID.randomUUID().toString()
//                }
//                println(url)

//                supabase.gotrue.exchangeCodeForSession()

//                val url = supabase.gotrue.oAuthUrl(
//                    provider = Google,
//                    redirectUrl = "http://localhost:5173/oAuthSuccess",
//                ) {
//                    queryParams["scope"] = "openid%20email"
//                    queryParams["redirect_url"] = "http://localhost:5173/oAuthSuccess"
//                    queryParams["response_type"] = "code"
//                    queryParams["nonce"] = java.util.UUID.randomUUID().toString()
//                    queryParams["state"] = java.util.UUID.randomUUID().toString()
//                }
                call.respondSuccess("OAuth login prompt successful.")
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

                println("Access Token")
                println(accessToken)
                println("Refresh Token")
                println(refreshToken)

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
                val publicUserDataNotFound = supabase.postgrest["public_user_data"].select(
                    columns = Columns.list(
                        "createdAt, currency, darkModeEnabled, accessibilityEnabled, profileIconFileName"
                    )
                ).decodeSingleOrNull<PublicUserDataResponse>() == null
                val totalIncomeNotFound =
                    supabase.postgrest["total_income"].select(columns = Columns.list("totalIncome"))
                        .decodeSingleOrNull<TotalIncomeResponse>() == null

                if (publicUserDataNotFound) {
                    initialiseDefaultPublicUserData(call)
                }

                if (totalIncomeNotFound) {
                    initialiseDefaultIncome(call)
                }

                if (publicUserDataNotFound && totalIncomeNotFound) {
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

        post("/api/restoreDefaultBudget") {
            try {
                initialiseDefaultBudgets(call, true)
                call.respondSuccess("Successfully restored default budget.")
            } catch (e: Exception) {
                call.application.log.error("Error while restoring default budget.", e)
                call.respondError("Error while restoring default budget: $e")
            }
        }
    }
}