package com.example.plugins

import com.example.entities.*
import io.github.jan.supabase.createSupabaseClient
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
import kotlinx.serialization.Serializable
import org.apache.hc.core5.http.HttpHost
import java.util.*

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
                val receivedExpenseItem = call.receive<ExpenseItemRequestReceived>()

                val requestedCategory = receivedExpenseItem.category
                val requestedCategoryId = supabase.postgrest["categories"]
                    .select(columns = Columns.list("categoryId")) {
                        eq("categoryName", requestedCategory)
                    }.decodeList<CategoryIdOnly>().first().categoryId


                val itemToInsert = ExpenseItemRequestSent(
                    userId = receivedExpenseItem.userId,
                    categoryId = requestedCategoryId,
                    amount = receivedExpenseItem.amount
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
                val expenseIdToDelete = call.receive<ExpenseIdOnly>()
                val deletedExpense = supabase.postgrest["expenses"].delete {
                    eq("expenseId", expenseIdToDelete.expenseId)
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
            val expense = call.receive<ExpenseItemResponse>()
            val updatedItem = supabase.postgrest["expenses"].update(
                {
                    set("amount", expense.amount)
                }
            ) {
                eq("categoryId", expense.categoryId.toString())
            }.decodeSingle<ExpenseItemResponse>()
            println(updatedItem.categoryId)
            call.respond(updatedItem)
        }
//
//        get("/api/getExpenses") {
//            val listItems = supabase.postgrest["expenses"].select(columns = Columns.list("category, categoryId, amount")).decodeList<GenericListItem>()
//            if (listItems.isNotEmpty()) {
//                val listItem = listItems.first()
//                println(listItem.category)
//            } else {
//                println("No items found")
//            }
//            call.respond(listItems)
//        }
//


//        get("/") {
////            println("URI: ${call.request.uri}") // "/"
////            println("Headers: ${call.request.headers.names()}")
////            println("User-Agent: ${call.request.headers["User-Agent"]}")
////            println("Host: ${call.request.headers["Host"]}")
////            println("Connection: ${call.request.headers["Connection"]}")
////            println("Query Parameters: ${call.request.queryParameters.names()}")
////            println("Username: ${call.request.queryParameters["usr"]}")
////            println("Password: ${call.request.queryParameters["pw"]}")
//            call.respondText("Front Website Here")
//        }

        get("/api/expenses") {
            call.respondText("Expenses API Here")
        }

        get("/api/budget") {
            call.respondText("Budget API Here")
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