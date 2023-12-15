package com.example.plugins

import com.example.entities.budget.*
import com.example.entities.expense.*
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import com.example.entities.user.UserEmail
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.github.jan.supabase.postgrest.rpc
import io.ktor.client.*
import io.ktor.client.engine.apache5.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.apache.hc.core5.http.HttpHost

fun Application.staticResources() {
    routing {
        staticResources("/", "static/dist") {
            default("index.html")
        }
    }
}

fun Application.configureRouting() {
        val supabaseUrl = "https://pdtitoimxnivxfswjhty.supabase.co"
        val supabaseKey = System.getenv("SUPABASE_KEY")
        val supabase = createSupabaseClient(supabaseUrl, supabaseKey) {
            install(Postgrest)
            install(GoTrue)
            val client = HttpClient(Apache5) {
                engine {
                    followRedirects = true
                    socketTimeout = 10_000
                    connectTimeout = 10_000
                    connectionRequestTimeout = 20_000
                    customizeClient {
                        setProxy(HttpHost("127.0.0.1", 8080))
                    }
                }
            }
        }

//    val listItems = supabase.postgrest["expenses"].select(columns = Columns.list("category, categoryId, amount")).decodeList<GenericListItem>()
//    if (listItems.isNotEmpty()) {
//        val listItem = listItems.first()
//        println(listItem.category)
//    } else {
//        println("No items found")
//    }


//    val itemToInsert = GenericListItem(category = "InsertedValue3", categoryId = 9426, amount = 1)
//    val test = supabase.postgrest["expenses"].insert(itemToInsert, returning = Returning.REPRESENTATION) //returning defaults to Returning.REPRESENTATION
//    println(test.body)

//    val itemToInsert = GenericListItem(category = "InsertedValue3", categoryId = 9426, amount = 1)
//    val test = supabase.postgrest["expenses"].insert(itemToInsert, returning = Returning.MINIMAL) //returning defaults to Returning.REPRESENTATION
//    println(test.body)


//    val updatedItem = supabase.postgrest["expenses"].update(
//        {
//            set("categoryId", "942")
//        }
//    ) {
//        eq("categoryId", "379817289189")
//    }.decodeSingle<GenericListItem>()
//    println(updatedItem.categoryId)

//    supabase.postgrest["expenses"].delete {
//        eq("categoryId", "942")
//    }


    routing {

        post("/api/createExpense") {
            try {
                val expenseCreateRequest = call.receive<ExpenseCreateRequestReceived>()

                val itemToInsert = ExpenseCreateRequestSent(
                    userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id,
                    category = expenseCreateRequest.category,
                    amount = expenseCreateRequest.amount,
                    timestamp = expenseCreateRequest.timestamp
                )
                val insertedItem = supabase.postgrest["expenses"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expense added successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not added."))
            }
        }

        delete("/api/deleteExpense") {
            try {
                val expenseDeleteRequest = call.receive<ExpenseDeleteRequestReceived>()
                val deletedExpense = supabase.postgrest["expenses"].delete {
                    eq("expenseId", expenseDeleteRequest.expenseId)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (deletedExpense.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not deleted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expense deleted successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not deleted."))
            }
        }

        put("/api/updateExpense") {
            try {
                val expenseUpdateRequest = call.receive<ExpenseUpdateRequestReceived>()

                val updatedCategory = expenseUpdateRequest.category

                val updatedItem = supabase.postgrest["expenses"].update(
                    {
                        set("amount", expenseUpdateRequest.amount)
                        set("category", updatedCategory)
                    }
                ) {
                    eq("expenseId", expenseUpdateRequest.expenseId)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not updated"))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expense updated."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not updated."))
            }
        }

        get("/api/getExpenses") {
            try {
                val expenseList = supabase.postgrest["expenses"].select() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                    .decodeList<ExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, expenseList)

            } catch (e: Exception) {
                call.application.log.error("Error while reading expenses", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expenses not read."))
            }
        }
        post("/api/createBudget") {
            try {
                val budgetCreateRequest = call.receive<BudgetCreateRequestReceived>()

                val itemToInsert = BudgetCreateRequestSent(
                    userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id,
                    category = budgetCreateRequest.category,
                    amount = budgetCreateRequest.amount,
                    iconPath = budgetCreateRequest.iconPath,
                    group = budgetCreateRequest.group
                )
                val insertedItem = supabase.postgrest["budgets"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget added successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not added."))
            }
        }

        delete("/api/deleteBudget") {
            try {
                val budgetDeleteRequest = call.receive<BudgetDeleteRequestReceived>()
                val deletedBudget = supabase.postgrest["budgets"].delete {
                    eq("category", budgetDeleteRequest.category)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (deletedBudget.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not deleted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Budge deleted successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not deleted."))
            }
        }

        put("/api/updateBudget") {
            try {
                val budgetUpdateRequest = call.receive<BudgetUpdateRequestReceived>()

                val updatedCategory = budgetUpdateRequest.category

                val updatedItemNoIconOrGroup = supabase.postgrest["budgets"].update(
                    {
                        set("amount", budgetUpdateRequest.amount)
                        set("category", updatedCategory)
                    }
                ) {
                    eq("category", budgetUpdateRequest.category)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedItemNoIconOrGroup.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not updated"))
                } else {
                    if (budgetUpdateRequest.iconPath != "") {
                        val updatedItemIconOnly = supabase.postgrest["budgets"].update(
                            {
                                set("iconPath", budgetUpdateRequest.iconPath)
                            }
                        ) {
                            eq("category", updatedCategory)
                            eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                        }
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget updated."))
                    }
                    if (budgetUpdateRequest.group != "") {
                        val updatedItemGroupOnly = supabase.postgrest["budgets"].update(
                            {
                                set("group", budgetUpdateRequest.group)
                            }
                        ) {
                            eq("category", updatedCategory)
                            eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                        }
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget updated."))
                    }
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not updated."))
            }
        }

        get("/api/getBudget") {
            try {
                val budgetList = supabase.postgrest["budgets"].select() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
//                    eq("userId", supabase.gotrue.currentSessionOrNull()?.user?.id!!)
                }
                    .decodeList<BudgetItemResponse>()

                call.respond(HttpStatusCode.OK, budgetList)

            } catch (e: Exception) {
                call.application.log.error("Error while reading budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not read."))
            }
        }

        post("/api/register") {
            try {
                val userCreds = call.receive<UserInfo>()
                val user = supabase.gotrue.signUpWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }
                call.respond(HttpStatusCode.OK, SuccessResponseSent("User added successfully."))
            } catch (e: Exception) {
                call.application.log.error("Error while creating user", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("User not added."))
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
                val session = supabase.gotrue.refreshSession(refreshToken = "refreshToken")
                val loggedInUser = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                call.respond(HttpStatusCode.OK, loggedInUser)
            } else {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("User already logged in."))
            }
        }

        get("/api/getUserEmail") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                if (currentUser != null) {
//                    val user = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                    call.respond(HttpStatusCode.OK, UserEmail(email = currentUser.user?.email!!))
                } else {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("No user logged in."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while checking for user", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while checking for user."))
            }
        }
//
//        get("/api/checkForUser") {
//            val currentUser = supabase.gotrue.currentSessionOrNull()
//            try {
//                val statusJSON = if (currentUser != null) {
//                    val user = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
//                    UserStatusCheck(loggedIn = false)
//                } else {
//                    UserStatusCheck(loggedIn = true)
//                }
//                call.respond(HttpStatusCode.OK, statusJSON)
//            } catch (e: Exception) {
//                call.application.log.error("Error while checking for user", e)
//                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while checking for user."))
//            }
//        }


        post("/api/logout") {
            val currentUser = supabase.gotrue.currentSessionOrNull()
            if (currentUser != null) {
                supabase.gotrue.logout()
                call.respond(HttpStatusCode.OK, SuccessResponseSent(currentUser.user?.email!!))
            } else {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("No user logged in."))
            }
        }

//        get("/blog/{page}") {
//            val pageNumber = call.parameters["page"]
//            call.respondText("You are on page $pageNumber")
//        }
//
//        post("/login") {
//            val userInfo = call.receive<UserInfo>()
//            println(userInfo)
//            call.respondText("Post request functional.")
//        }
//
//        get("/json") {
//            val myJSON = UserInfo("123@123.com", "pwpwpw")
//            call.respond(myJSON);
//        }
//
//        get("/headers") {
//            call.response.headers.append("fruit", "orange")
//            call.respondText("Extra header attached.")
//        }
//
//        get("/fileDownload") {
//            val file = File("iris.jpg")
//
//            call.response.header(
//                HttpHeaders.ContentDisposition,
//                ContentDisposition.Attachment.withParameter(
//                    ContentDisposition.Parameters.FileName, "openImage.jpg"
//                ).toString()
//            )
//            call.respondFile(file)
//        }
//
//
//        get("/fileOpen") {
//            val file = File("iris.jpg")
//
//            call.response.header(
//                HttpHeaders.ContentDisposition,
//                ContentDisposition.Inline.withParameter(
//                    ContentDisposition.Parameters.FileName, "openImage.jpg"
//                ).toString()
//            )
//            call.respondFile(file)
//        }
    }
}

@Serializable
data class UserInfo (
    val email: String,
    val password: String
)