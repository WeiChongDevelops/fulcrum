package com.example.plugins

import com.example.SupabaseClient.supabase
import com.example.entities.budget.BudgetItemResponse
import com.example.entities.budget.GroupItemResponse
import com.example.entities.expense.ExpenseItemResponse
import com.example.entities.recurringExpense.BlacklistedExpenseItemResponse
import com.example.entities.recurringExpense.RecurringExpenseItemResponse
import com.example.entities.user.*
import com.example.getActiveUserId
import com.example.respondAuthError
import com.example.respondError
import com.example.respondSuccess
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.lang.IllegalStateException

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
                var noCategoriesFound = false
                var noGroupsFound = false

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
                        columns = Columns.list("group, colour, timestamp")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingleOrNull<GroupItemResponse>() != null
                ) {
                    val wipeRequestSent = supabase.postgrest["groups"].delete() {
                        eq("userId", getActiveUserId())
                        neq("group", "Miscellaneous")
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


        // USER PREFERENCES //

        get("/api/getUserPreferences") {
            try {
                val userData =
                    supabase.postgrest["user_preferences"].select(
                        columns = Columns.list("currency, createdAt, darkModeEnabled, accessibilityEnabled, profileIconFileName")
                    ) {
                        eq("userId", getActiveUserId())
                    }.decodeSingle<UserPreferencesResponse>()
                call.respond(HttpStatusCode.OK, userData)
            } catch (e: UnauthorizedRestException) {
                call.application.log.error("Not authorised - JWT token likely expired.", e)
                call.respondAuthError("Not authorised - JWT token likely expired: $e")
            } catch (e: IllegalStateException) {
                call.application.log.error("Session not found.", e)
                call.respondAuthError("Session not found: $e")
            } catch (e: Exception) {
                call.application.log.error("Error while retrieving user preferences", e)
                call.respondError("Error while retrieving user preferences: $e")
            }
        }

        put("/api/updateUserPreferences") {
            try {
                val userPreferencesUpdateRequest = call.receive<UserPreferencesUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["user_preferences"].update(
                    {
                        set("currency", userPreferencesUpdateRequest.currency)
                        set("darkModeEnabled", userPreferencesUpdateRequest.darkModeEnabled)
                        set("accessibilityEnabled", userPreferencesUpdateRequest.accessibilityEnabled)
                        set("profileIconFileName", userPreferencesUpdateRequest.profileIconFileName)
                    }
                ) {
                    eq("userId", getActiveUserId())
                }

                if (updatedItem.body == null) {
                    call.respondError("User preferences update failed")
                } else {
                    call.respondSuccess("User preferences update successful")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating user preferences", e)
                call.respondError("Error while updating user preferences: $e")
            }
        }

    }
}