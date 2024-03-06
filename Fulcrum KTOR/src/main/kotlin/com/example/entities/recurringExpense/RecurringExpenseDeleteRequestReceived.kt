package com.example.entities.recurringExpense

import kotlinx.serialization.Serializable

@Serializable
data class RecurringExpenseDeleteRequestReceived(
    val recurringExpenseId: String
)
