package com.example.plugins

import com.example.SupabaseClient.supabase
import com.example.entities.expense.*
import com.example.entities.recurringExpense.*
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import com.example.respondAuthError
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.datetime.Instant
import java.lang.IllegalStateException

fun Application.configureExpenseRouting() {

    suspend fun getActiveUserId(): String {
        return supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id
    }

    suspend fun ApplicationCall.respondSuccess(message: String) {
        respond(HttpStatusCode.OK, SuccessResponseSent(message))
    }

    suspend fun ApplicationCall.respondError(message: String) {
        respond(HttpStatusCode.BadRequest, ErrorResponseSent(message))
    }

    routing {

        // EXPENSE API //

        post("/api/createExpense") {
            try {
                val expenseCreateRequest = call.receive<ExpenseCreateRequestReceived>()

                val itemToInsert = ExpenseCreateRequestSent(
                    userId = getActiveUserId(),
                    category = expenseCreateRequest.category,
                    amount = expenseCreateRequest.amount,
                    timestamp = expenseCreateRequest.timestamp,
                    recurringExpenseId = expenseCreateRequest.recurringExpenseId
                )
                val insertedItem = supabase.postgrest["expenses"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respondError("Expense not added.")
                } else {
                    call.respondSuccess("Expense added successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating expense", e)
                call.respondError("Expense not added.")
            }
        }

        get("/api/getExpenses") {
            try {
                val expenseList = supabase.postgrest["expenses"].select() {
                    eq("userId", getActiveUserId())
                }
                    .decodeList<ExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, expenseList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading expenses", e)
                call.respondError("Expenses not read.")
            }
        }

        put("/api/updateExpense") {
            try {
                val expenseUpdateRequest = call.receive<ExpenseUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["expenses"].update(
                    {
                        set("category", expenseUpdateRequest.category)
                        set("amount", expenseUpdateRequest.amount)
                        set("timestamp", expenseUpdateRequest.timestamp)
                    }
                ) {
                    eq("expenseId", expenseUpdateRequest.expenseId)
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Expense not updated")
                } else {
                    call.respondSuccess("Expense updated.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating expense", e)
                call.respondError("Expense not updated.")
            }
        }

        put("/api/updateRecurringExpenseInstance") {
            try {
                val expenseInstanceUpdateRequest = call.receive<RecurringExpenseInstanceUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["expenses"].update(
                    {
                        set("category", expenseInstanceUpdateRequest.category)
                        set("amount", expenseInstanceUpdateRequest.amount)
                        set("recurringExpenseId", expenseInstanceUpdateRequest.recurringExpenseId)
                    }
                ) {
                    eq("expenseId", expenseInstanceUpdateRequest.expenseId)
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Recurring expense instance not updated")
                } else {
                    call.respondSuccess("Recurring expense instance updated.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating recurring expense instance", e)
                call.respondError("Recurring expense instance not updated.")
            }
        }

        delete("/api/deleteExpense") {
            try {
                val expenseDeleteRequest = call.receive<ExpenseDeleteRequestReceived>()
                val deletedExpense = supabase.postgrest["expenses"].delete {
                    eq("expenseId", expenseDeleteRequest.expenseId)
                    eq("userId", getActiveUserId())
                }

                if (deletedExpense.body == null) {
                    call.respondError("Expense not deleted.")
                } else {
                    call.respondSuccess("Expense deleted successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting expense", e)
                call.respondError("Expense not deleted.")
            }
        }

        delete("/api/batchDeleteExpenses") {
            try {
                val batchExpenseDeleteRequest = call.receive<BatchExpenseDeleteRequestReceived>()
                for (expenseId in batchExpenseDeleteRequest.expenseIdsToDelete) {
                    val deletedExpense = supabase.postgrest["expenses"].delete {
                        eq("expenseId", expenseId)
                    }
                    if (deletedExpense.body == null) {
                        call.respondError("A batched expense deletion failed.")
                    } else {
                        call.respondSuccess("A batched expense deletion succeeded.")
                    }
                }
            } catch (e: Exception) {
                call.respondError("Batch expense deletion unsuccessful.")
            }
        }

        // RECURRING EXPENSE API //

        post("/api/createRecurringExpense") {
            try {
                val recurringExpenseCreateRequest = call.receive<RecurringExpenseCreateRequestReceived>()

                val itemToInsert = RecurringExpenseCreateRequestSent(
                    recurringExpenseId = recurringExpenseCreateRequest.recurringExpenseId,
                    userId = getActiveUserId(),
                    category = recurringExpenseCreateRequest.category,
                    amount = recurringExpenseCreateRequest.amount,
                    timestamp = recurringExpenseCreateRequest.timestamp,
                    frequency = recurringExpenseCreateRequest.frequency
                )
                val insertedItem = supabase.postgrest["recurring_expenses"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respondError("Recurring expense not added.")
                } else {
                    call.respondSuccess("Recurring expense added successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating recurring expense", e)
                call.respondError("Recurring expense not added.")
            }
        }

        get("/api/getRecurringExpenses") {
            try {
                val recurringExpenseList = supabase.postgrest["recurring_expenses"].select() {
                    eq("userId", getActiveUserId())
                }
                    .decodeList<RecurringExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, recurringExpenseList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading recurring expenses", e)
                call.respondError("Recurring expenses not read.")
            }
        }

        put("/api/updateRecurringExpense") {
            try {
                val recurringExpenseUpdateRequest = call.receive<RecurringExpenseUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["recurring_expenses"].update(
                    {
                        set("category", recurringExpenseUpdateRequest.category)
                        set("amount", recurringExpenseUpdateRequest.amount)
                        set("timestamp", recurringExpenseUpdateRequest.timestamp)
                        set("frequency", recurringExpenseUpdateRequest.frequency)
                    }
                ) {
                    eq("recurringExpenseId", recurringExpenseUpdateRequest.recurringExpenseId)
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Recurring expense not updated")
                } else {
                    call.respondSuccess("Recurring expense updated.")
                }
            } catch (e: Exception) {
                call.respondError("Recurring expense not updated.")
            }
        }

        delete("/api/deleteRecurringExpense") {
            try {
                val expenseDeleteRequest = call.receive<RecurringExpenseDeleteRequestReceived>()
                val deletedExpense = supabase.postgrest["recurring_expenses"].delete {
                    eq("recurringExpenseId", expenseDeleteRequest.recurringExpenseId)
                    eq("userId", getActiveUserId())
                }

                if (deletedExpense.body == null) {
                    call.respondError("Recurring expense not deleted.")
                } else {
                    call.respondSuccess("Recurring expense deleted successfully.")
                }
            } catch (e: Exception) {
                call.respondError("Recurring expense not deleted.")
            }
        }

        suspend fun checkIfRemovedRecurringExpenseExists(recurringExpenseId: String, timestampOfRemovedInstance: Instant): Boolean {
            val response = supabase.postgrest["removed_recurring_expenses"].select(columns = Columns.list("recurringExpenseId", "timestampOfRemovedInstance")) {
                eq("userId", getActiveUserId())
                eq("recurringExpenseId", recurringExpenseId)
                eq("timestampOfRemovedInstance", timestampOfRemovedInstance)
            }.decodeList<RemovedRecurringExpenseItemResponse>()
            return response.isNotEmpty();
        }

        post("/api/createRemovedRecurringExpense") {
            try {
                val removedRecurringExpenseRequest = call.receive<RemovedRecurringExpenseCreateRequestReceived>()

                val recurringExpenseId = removedRecurringExpenseRequest.recurringExpenseId
                val timestampOfRemovedInstance = removedRecurringExpenseRequest.timestampOfRemovedInstance

                if (!checkIfRemovedRecurringExpenseExists(recurringExpenseId, timestampOfRemovedInstance)) {
                    val itemToInsert = RemovedRecurringExpenseCreateRequestSent (
                        recurringExpenseId = recurringExpenseId,
                        timestampOfRemovedInstance = timestampOfRemovedInstance
                    )

                    val insertedItem = supabase.postgrest["removed_recurring_expenses"].insert(
                        itemToInsert,
                        returning = Returning.REPRESENTATION
                    )

                    if (insertedItem.body == null) {
                        call.respondError("Removed recurring expense instance not added.")
                    } else {
                        call.respondSuccess("Removed recurring expense instance added successfully.")
                    }
                } else {
                    call.respondSuccess("Entry already exists.")
                }

            } catch (e: Exception) {
                call.application.log.error("Error while creating removed recurring expense instance", e)
                call.respondError("Removed recurring expense instance not added.")
            }
        }

        get("/api/getRemovedRecurringExpenses") {
            try {
                val userId = getActiveUserId()
                val removedRecurringExpensesList = supabase.postgrest["removed_recurring_expenses"].select(columns = Columns.list("recurringExpenseId", "timestampOfRemovedInstance")) {
                    eq("userId", userId)
                }.decodeList<RemovedRecurringExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, removedRecurringExpensesList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading removed recurring expenses", e)
                call.respondError("Removed recurring expenses not read.")
            }
        }
    }
}