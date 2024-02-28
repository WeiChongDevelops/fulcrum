package com.example.entities.expense

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class RecurringExpenseInstanceUpdateRequestReceived(
    val expenseId: String,
    val amount: Double,
    val category: String,
    val recurringExpenseId: String?
)
