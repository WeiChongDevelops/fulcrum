package com.example.plugins

import com.example.SupabaseClient.supabase
import com.example.entities.budget.BudgetItemResponse
import com.example.entities.budget.GroupItemResponse
import com.example.entities.expense.ExpenseItemResponse
import com.example.entities.recurringExpense.BlacklistedExpenseItemResponse
import com.example.entities.recurringExpense.RecurringExpenseItemResponse
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import com.example.entities.user.*
import com.example.getActiveUserId
import com.example.respondError
import com.example.respondSuccess
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.reflect.KClass

fun Application.configureOtherRouting() {


    routing {

        // BROADER DESTRUCTIVE API //

        delete("/api/wipeExpenses") {
            try {

                var noExpensesFound = false
                var noRecurringExpensesFound = false

                if (supabase.postgrest["expenses"].select(
                        columns = Columns.list("expenseId, category, amount, timestamp, recurringExpenseId")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingleOrNull<ExpenseItemResponse>() != null
                ) {
                    val wipeRequestSent = supabase.postgrest["expenses"].delete() {
                        eq("userId", getActiveUserId())
                    }
                    if (wipeRequestSent.body == null) {
                        call.respondError("Standard expense wipe failed.")
                    }
                } else {
                    noExpensesFound = true
                }

                if (supabase.postgrest["recurring_expenses"].select(
                        columns = Columns.list("frequency, category, amount, timestamp, recurringExpenseId")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingleOrNull<RecurringExpenseItemResponse>() != null
                ) {
                    val wipeRequestSent = supabase.postgrest["recurring_expenses"].delete() {
                        eq("userId", getActiveUserId())
                    }
                    if (wipeRequestSent.body == null) {
                        call.respondError("Recurring expense wipe failed.")
                    }
                } else {
                    noRecurringExpensesFound = true
                }

                if (supabase.postgrest["removed_recurring_expenses"].select(
                        columns = Columns.list("recurringExpenseId, timestampOfRemovedInstance")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingleOrNull<BlacklistedExpenseItemResponse>() != null
                ) {
                    val wipeRequestSent = supabase.postgrest["removed_recurring_expenses"].delete() {
                        eq("userId", getActiveUserId())
                    }
                    if (wipeRequestSent.body == null) {
                        call.respondError("Blacklist wipe failed.")
                    }
                }

                val appendedInfo = if (!noExpensesFound && !noRecurringExpensesFound) "" else {
                    ", although${if (noExpensesFound) ", no expenses were found" else ""}${if (noRecurringExpensesFound) ", no recurring expenses were found." else "."}"
                }
                call.respondSuccess("Expenses wiped successfully$appendedInfo")
            } catch (e: Exception) {
                call.respondError("Error while wiping expenses: $e.")
            }
        }

        delete("/api/wipeBudget") {
            try {
                var noCategoriesFound = false;
                var noGroupsFound = false;

                if (supabase.postgrest["budgets"].select(
                        columns = Columns.list("category, amount, iconPath, group, timestamp")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingleOrNull<BudgetItemResponse>() != null
                ) {
                    val wipeRequestSent = supabase.postgrest["budgets"].delete() {
                        eq("userId", getActiveUserId())
                    }
                    if (wipeRequestSent.body == null) {
                        call.respondError("Items not wiped.")
                    }
                } else {
                    noCategoriesFound = true
                }

                if (supabase.postgrest["groups"].select(
                        columns = Columns.list("group, colour, dateCreated")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingleOrNull<GroupItemResponse>() != null
                ) {
                    val wipeRequestSent = supabase.postgrest["groups"].delete() {
                        eq("userId", getActiveUserId())
                    }
                    if (wipeRequestSent.body == null) {
                        call.respondError("Items not wiped.")
                    }
                } else {
                    noGroupsFound = true
                }

                val appendedInfo = if (!noCategoriesFound && !noGroupsFound) "" else {
                    ", although${if (noCategoriesFound) ", no categories were found" else ""}${if (noGroupsFound) ", no groups were found." else "."}"
                }
                call.respondSuccess("Budget wiped successfully$appendedInfo.")
            } catch (e: Exception) {
                call.respondError("Error while wiping budget: $e")
            }
        }

//        delete("/api/wipeData"){
//            try {
//                wipeTableIfPopulated("budget", call)
//                wipeTableIfPopulated("expenses", call)
//                wipeTableIfPopulated("recurring_expenses", call)
//                call.respondSuccess("Data wiped successfully.")
//            } catch (e: Exception) {
//                call.respondError("Error while wiping data.")
//            }
//        }


        // PUBLIC USER DATA //

        get("/api/getPublicUserData") {
            try {
                val userData =
                    supabase.postgrest["public_user_data"].select(
                        columns = Columns.list("currency, createdAt, darkModeEnabled, accessibilityEnabled, profileIconFileName")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingle<PublicUserDataResponse>()
                call.respond(HttpStatusCode.OK, userData)
            } catch (e: Exception) {
                call.application.log.error("Error while retrieving public user data", e)
                call.respondError("Error while retrieving public user data: $e")
            }
        }

        put("/api/updatePublicUserData") {
            try {
                val publicUserDataUpdateRequest = call.receive<PublicUserDataUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["public_user_data"].update(
                    {
                        set("currency", publicUserDataUpdateRequest.currency)
                        set("darkModeEnabled", publicUserDataUpdateRequest.darkModeEnabled)
                        set("accessibilityEnabled", publicUserDataUpdateRequest.accessibilityEnabled)
                        set("profileIconFileName", publicUserDataUpdateRequest.profileIconFileName)
                    }
                ) {
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("Public user data update failed")
                } else {
                    call.respondSuccess("Public user data update successful")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating public user data", e)
                call.respondError("Error while updating public user data: $e")
            }
        }

    }
}