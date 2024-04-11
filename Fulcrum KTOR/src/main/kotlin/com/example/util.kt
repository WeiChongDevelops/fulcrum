package com.example

import com.example.entities.budget.BudgetCreateRequestSent
import com.example.entities.budget.GroupCreateRequestSent
import com.example.entities.expense.ExpenseItemResponse
import com.example.entities.recurringExpense.BlacklistedExpenseCreateRequestSent
import com.example.entities.recurringExpense.BlacklistedExpenseItemResponse
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.client.*
import io.ktor.client.engine.apache5.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import kotlinx.datetime.Instant
import org.apache.hc.core5.http.HttpHost

object SupabaseClient {
    private const val SUPABASE_URL = "https://pdtitoimxnivxfswjhty.supabase.co"
    private val supabaseKey = System.getenv("SUPABASE_KEY")
    val supabase = createSupabaseClient(SUPABASE_URL, supabaseKey) {
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
}

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

fun getDefaultGroups(uid: String): List<GroupCreateRequestSent> {
    return listOf(
        GroupCreateRequestSent(userId = uid, group = "Savings", colour = "#9fd5be"),
        GroupCreateRequestSent(userId = uid, group = "Miscellaneous", colour = "#3f4240"),
        GroupCreateRequestSent(userId = uid, group = "Food & Drink", colour = "#f1afa1"),
        GroupCreateRequestSent(userId = uid, group = "Housing", colour = "#7c86bf"),
        GroupCreateRequestSent(userId = uid, group = "Transport", colour = "#dfcde3")
    )
}

fun getDefaultCategories(uid: String): List<BudgetCreateRequestSent> {
    return listOf(
        BudgetCreateRequestSent(
            userId = uid,
            category = "Other",
            amount = 0.00,
            iconPath = "category-default-icon.svg",
            group = "Miscellaneous"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Emergency Funds",
            amount = 0.00,
            iconPath = "category-emergency-icon.svg",
            group = "Savings"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Drinks",
            amount = 0.00,
            iconPath = "category-beer-icon.svg",
            group = "Food & Drink"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Groceries",
            amount = 0.00,
            iconPath = "category-cart-icon.svg",
            group = "Food & Drink"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Restaurant",
            amount = 0.00,
            iconPath = "category-utencils-icon.svg",
            group = "Food & Drink"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Rent",
            amount = 0.00,
            iconPath = "category-house-icon.svg",
            group = "Housing"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Water",
            amount = 0.00,
            iconPath = "category-water-icon.svg",
            group = "Housing"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Electricity",
            amount = 0.00,
            iconPath = "category-electricity-icon.svg",
            group = "Housing"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Internet",
            amount = 0.00,
            iconPath = "category-wifi-icon.svg",
            group = "Housing"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Petrol",
            amount = 0.00,
            iconPath = "category-petrol-icon.svg",
            group = "Transport"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Parking",
            amount = 0.00,
            iconPath = "category-car-icon.svg",
            group = "Transport"
        ),
        BudgetCreateRequestSent(
            userId = uid,
            category = "Public Transport",
            amount = 0.00,
            iconPath = "category-train-icon.svg",
            group = "Transport"
        )
    )
}