package com.example

import com.example.entities.budget.BudgetCreateRequestReceived
import com.example.entities.budget.BudgetDeleteRequestReceived
import com.example.entities.budget.BudgetItemResponse
import com.example.entities.budget.BudgetUpdateRequestReceived
import com.example.entities.expense.ExpenseCreateRequestReceived
import com.example.entities.expense.ExpenseDeleteRequestReceived
import com.example.entities.expense.ExpenseItemResponse
import com.example.entities.expense.ExpenseUpdateRequestReceived
import com.example.entities.user.UserCredentials
import com.example.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import kotlinx.datetime.Clock
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.*
import kotlin.test.*
import java.util.UUID


fun Application.testModule() {
    routing {
        get("/example") {
            call.respondText("Hello World!", status = HttpStatusCode.OK)
        }
    }
}

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            testModule()
        }
        client.get("/example").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertEquals("Hello World!", bodyAsText())
        }
    }

    @Test
    fun testExpenseFlow() = testApplication {
        install(ContentNegotiation) {
            json()
        }
        application {
            configureAuthRouting()
            configureBudgetRouting()
            configureExpenseRouting()
            configureOtherRouting()
        }

        val testUserId = UUID.randomUUID().toString()
        val testUserEmail = "testuser.$testUserId@fulcrum.com"
        val testUserPassword = "pAssword1"
        val testExpenseCategory = "Food"
        val testExpenseAmount = 100.0
        val testTimestamp = Clock.System.now()

        // Register user
        client.post("/api/register") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(UserCredentials(testUserEmail, testUserPassword)))
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Registration failed at /api/register")
            val expectedOutput = """{"success":"User added successfully with all defaults."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect registration response at /api/register")
        }

        // Log in
        client.post("/api/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(UserCredentials(testUserEmail, testUserPassword)))
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Login failed at /api/login")
        }

        // Create expense
        val testExpenseId = UUID.randomUUID().toString()
        client.post("/api/createExpense") {
            contentType(ContentType.Application.Json)
            setBody(
                Json.encodeToString(
                    ExpenseCreateRequestReceived(
                        testExpenseId,
                        testExpenseCategory,
                        testExpenseAmount,
                        testTimestamp,
                        null
                    )
                )
            )
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Expense creation failed at /api/createExpense")
            val expectedOutput = """{"success":"Expense creation successful."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect expense creation response at /api/createExpense")
        }

        // Retrieve expense
        client.get("/api/getExpenses").apply {
            assertEquals(HttpStatusCode.OK, status, "Expense retrieval failed at /api/getExpenses")
            assertEquals(
                "[${
                    Json.encodeToString(
                        ExpenseItemResponse(
                            expenseId = testExpenseId,
                            category = testExpenseCategory,
                            amount = testExpenseAmount,
                            timestamp = testTimestamp,
                            recurringExpenseId = null
                        )
                    )
                }]", bodyAsText(), "Incorrect or missing expense data at /api/getExpenses"
            )
        }

        // Update expense
        client.put("/api/updateExpense") {
            contentType(ContentType.Application.Json)
            setBody(
                Json.encodeToString(
                    ExpenseUpdateRequestReceived(
                        testExpenseId,
                        testExpenseCategory,
                        testExpenseAmount + 50,
                        testTimestamp,
                        null
                    )
                )
            )
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Expense update failed at /api/updateExpense")
            val expectedOutput = """{"success":"Expense updating successful."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect expense update response at /api/updateExpense")
        }

        // Retrieve updated expense
        client.get("/api/getExpenses").apply {
            assertEquals(HttpStatusCode.OK, status, "Updated expense retrieval failed at /api/getExpenses")
            assertTrue(
                bodyAsText().contains("\"amount\":${testExpenseAmount + 50}"),
                "Updated amount not reflected at /api/getExpenses"
            )
        }

        // Delete expense
        client.delete("/api/deleteExpense") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(ExpenseDeleteRequestReceived(testExpenseId)))
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Expense deletion failed at /api/deleteExpense")
            val expectedOutput = """{"success":"Expense deletion successful."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect expense deletion response at /api/deleteExpense")
        }

        // Log out
        client.post("/api/logout").apply {
            assertEquals(HttpStatusCode.OK, status, "Logout failed at /api/logout")
            val expectedOutput = """{"success":"Logged out $testUserEmail."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect logout response at /api/logout")
        }
    }

    @Test
    fun testFullBudgetFlow() = testApplication {
        install(ContentNegotiation) {
            json()
        }
        application {
            configureAuthRouting()
            configureBudgetRouting()
            configureExpenseRouting()
            configureOtherRouting()
        }

        val testUserId = UUID.randomUUID().toString()
        val testUserEmail = "testuser.$testUserId@fulcrum.com"
        val testUserPassword = "pAssword1"
        val testBudgetCategory = "Leisure"
        val testBudgetAmount = 200.0
        val testBudgetIconPath = "/icons/leisure.svg"
        val testBudgetGroup = "Monthly"

        // Register user
        client.post("/api/register") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(UserCredentials(testUserEmail, testUserPassword)))
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Registration failed at /api/register")
            val expectedOutput = """{"success":"User added successfully with all defaults."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect registration response at /api/register")
        }

        // Log in
        client.post("/api/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(UserCredentials(testUserEmail, testUserPassword)))
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Login failed at /api/login")
        }

        // Create budget
        client.post("/api/createBudget") {
            contentType(ContentType.Application.Json)
            setBody(
                Json.encodeToString(
                    BudgetCreateRequestReceived(
                        testBudgetCategory,
                        testBudgetAmount,
                        testBudgetIconPath,
                        testBudgetGroup
                    )
                )
            )
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Budget creation failed at /api/createBudget")
            val expectedOutput = """{"success":"Budget creation successful."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect budget creation response at /api/createBudget")
        }

        // Retrieve budget
        client.get("/api/getBudget").apply {
            assertEquals(HttpStatusCode.OK, status, "Budget retrieval failed at /api/getBudget")
            val responseBody = bodyAsText()

            // Parse the response body text as JsonElement
            val jsonElement = Json.parseToJsonElement(responseBody)

            // Check if it's a JsonArray and perform assertions
            if (jsonElement is JsonArray) {
                val containsCategory = jsonElement.jsonArray.any {
                    it.jsonObject["category"]?.jsonPrimitive?.content?.equals(testBudgetCategory) == true
                }
                assertTrue(
                    containsCategory,
                    "Expected category '$testBudgetCategory' not found in the response at /api/getBudget"
                )

                val containsAmount = jsonElement.jsonArray.any {
                    it.jsonObject["amount"]?.jsonPrimitive?.doubleOrNull == testBudgetAmount
                }
                assertTrue(
                    containsAmount,
                    "Expected amount '$testBudgetAmount' not found in the response at /api/getBudget"
                )
            } else {
                fail("Expected a JSON array response at /api/getBudget")
            }
        }

        // Update budget
        val newBudgetAmount = 250.0
        client.put("/api/updateBudget") {
            contentType(ContentType.Application.Json)
            setBody(
                Json.encodeToString(
                    BudgetUpdateRequestReceived(
                        testBudgetCategory,
                        "New Leisure",
                        newBudgetAmount,
                        "Annual",
                        "/icons/new_leisure.svg"
                    )
                )
            )
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Budget update failed at /api/updateBudget")
            val expectedOutput = """{"success":"Budget update successful."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect budget update response at /api/updateBudget")
        }

        // Retrieve updated budget
        client.get("/api/getBudget").apply {
            assertEquals(HttpStatusCode.OK, status, "Updated budget retrieval failed at /api/getBudget")
            assertTrue(
                bodyAsText().contains("\"category\":\"New Leisure\""),
                "Updated category not found in response at /api/getBudget"
            )
            assertTrue(
                bodyAsText().contains("\"amount\":$newBudgetAmount"),
                "Updated amount not reflected in response at /api/getBudget"
            )
        }

        // Delete budget
        client.delete("/api/deleteBudget") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(BudgetDeleteRequestReceived("New Leisure")))
        }.apply {
            assertEquals(HttpStatusCode.OK, status, "Budget deletion failed at /api/deleteBudget")
            val expectedOutput = """{"success":"Budget deletion successful."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect budget deletion response at /api/deleteBudget")
        }

        // Log out
        client.post("/api/logout").apply {
            assertEquals(HttpStatusCode.OK, status, "Logout failed at /api/logout")
            val expectedOutput = """{"success":"Logged out $testUserEmail."}"""
            assertEquals(expectedOutput, bodyAsText(), "Incorrect logout response at /api/logout")
        }
    }
}
