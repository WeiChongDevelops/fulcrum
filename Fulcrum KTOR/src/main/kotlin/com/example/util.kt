package com.example

import com.example.entities.budget.BudgetCreateRequestSent
import com.example.entities.budget.GroupCreateRequestSent
import com.example.entities.expense.ExpenseItemResponse
import com.example.entities.recurringExpense.BlacklistedExpenseCreateRequestSent
import com.example.entities.recurringExpense.BlacklistedExpenseItemResponse
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import kotlinx.datetime.Instant

suspend fun getActiveUserId(): String {
    return SupabaseClient.supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id
}

suspend fun ApplicationCall.respondSuccess(message: String) {
    respond(HttpStatusCode.OK, SuccessResponseSent(message))
}

suspend fun ApplicationCall.respondError(message: String) {
    respond(HttpStatusCode.BadRequest, ErrorResponseSent(message))
}

suspend fun ApplicationCall.respondAuthError(message: String) {
    respond(HttpStatusCode.Unauthorized, ErrorResponseSent(message))
}


suspend fun checkIfBlacklistedExpenseExists(
    recurringExpenseId: String,
    timestampOfRemovedInstance: Instant
): Boolean {
    val response = SupabaseClient.supabase.postgrest["removed_recurring_expenses"].select(
        columns = Columns.list(
            "recurringExpenseId",
            "timestampOfRemovedInstance"
        )
    ) {
        eq("userId", getActiveUserId())
        eq("recurringExpenseId", recurringExpenseId)
        eq("timestampOfRemovedInstance", timestampOfRemovedInstance)
    }.decodeList<BlacklistedExpenseItemResponse>()
    return response.isNotEmpty();
}

suspend fun executeBlacklistedExpenseCreation(
    recurringExpenseId: String,
    timestampOfRemovedInstance: Instant,
    call: ApplicationCall
): Boolean {
    if (!checkIfBlacklistedExpenseExists(recurringExpenseId, timestampOfRemovedInstance)) {
        val itemToInsert = BlacklistedExpenseCreateRequestSent(
            recurringExpenseId = recurringExpenseId,
            timestampOfRemovedInstance = timestampOfRemovedInstance
        )

        val insertedItem = SupabaseClient.supabase.postgrest["removed_recurring_expenses"].insert(
            itemToInsert,
            returning = Returning.REPRESENTATION
        )

        if (insertedItem.body == null) {
            call.respondError("Blacklist entry creation failed.")
        }
        return false
    } else {
        return true
    }
}


suspend fun checkIfExpenseExists(expenseId: String): Boolean {
    val response = SupabaseClient.supabase.postgrest["expenses"].select(
        columns = Columns.list("expenseId, category, amount, timestamp, recurringExpenseId")
    )
    {
        eq("userId", getActiveUserId())
        eq("expenseId", expenseId)
    }.decodeList<ExpenseItemResponse>()
    return response.isNotEmpty();
}

suspend fun executeExpenseDeletion(expenseId: String, call: ApplicationCall): Boolean {
    return if (checkIfExpenseExists(expenseId)) {
        val deletedExpense = SupabaseClient.supabase.postgrest["expenses"].delete {
            eq("expenseId", expenseId)
            eq("userId", getActiveUserId())
        }
        if (deletedExpense.body == null) {
            call.respondError("Expense deletion failed.")
        }
        false
    } else {
        true
    }
}

fun getDefaultGroups(uid: String, miscellaneousExists: Boolean): List<GroupCreateRequestSent> {
    val groups = mutableListOf(
        GroupCreateRequestSent(userId = uid, group = "Savings", colour = "#d1fae5", id = 1),
        GroupCreateRequestSent(userId = uid, group = "Housing", colour = "#dbeafe", id = 2),
        GroupCreateRequestSent(userId = uid, group = "Transport", colour = "#fee2e2", id = 3),
        GroupCreateRequestSent(userId = uid, group = "Utilities", colour = "#cffafe", id = 4),
        GroupCreateRequestSent(userId = uid, group = "Food & Drink", colour = "#fef3c7", id = 5),
//        GroupCreateRequestSent(userId = uid, group = "Savings", colour = "#9fd5be"),
//        GroupCreateRequestSent(userId = uid, group = "Food & Drink", colour = "#f1afa1"),
//        GroupCreateRequestSent(userId = uid, group = "Housing", colour = "#7c86bf"),
//        GroupCreateRequestSent(userId = uid, group = "Utilities", colour = "#fbf5ab"),
//        GroupCreateRequestSent(userId = uid, group = "Transport", colour = "#dfcde3")
    )
    if (!miscellaneousExists) {
        groups.add(GroupCreateRequestSent(userId = uid, group = "Miscellaneous", colour = "#292524", id = 999))
    }
    return groups
}

fun getDefaultCategories(uid: String): List<BudgetCreateRequestSent> {
    return listOf(
        BudgetCreateRequestSent(
            userId = uid,
            category = "Other",
            amount = 100.00,
            iconPath = "Coin",
            group = "Miscellaneous"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Emergency Funds",
            amount = 500.00,
            iconPath = "FireExtinguisher",
            group = "Savings"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Drinks",
            amount = 150.00,
            iconPath = "Martini",
            group = "Food & Drink"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Groceries",
            amount = 400.00,
            iconPath = "ShoppingCart",
            group = "Food & Drink"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Restaurant",
            amount = 300.00,
            iconPath = "ForkKnife",
            group = "Food & Drink"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Rent",
            amount = 1500.00,
            iconPath = "HouseLine",
            group = "Housing"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Water",
            amount = 30.00,
            iconPath = "Drop",
            group = "Utilities"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Electricity",
            amount = 100.00,
            iconPath = "Lightning",
            group = "Utilities"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Internet",
            amount = 80.00,
            iconPath = "WifiHigh",
            group = "Utilities"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Petrol",
            amount = 200.00,
            iconPath = "GasPump",
            group = "Transport"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Parking",
            amount = 50.00,
            iconPath = "CarProfile",
            group = "Transport"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Public Transport",
            amount = 120.00,
            iconPath = "Train",
            group = "Transport"
        )
    )
}