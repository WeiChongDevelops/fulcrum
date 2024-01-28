package com.example.entities.expense

import kotlinx.serialization.Serializable

@Serializable
data class RecurringExpenseUpdateRequestReceived(
    val recurringExpenseId: String,
    val category: String,
    val amount: Double,
    val frequency: String
)
