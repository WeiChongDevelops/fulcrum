package com.example.entities.expense

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class RecurringExpenseUpdateRequestReceived(
    val recurringExpenseId: String,
    val category: String,
    val amount: Double,
    @Contextual val timestamp: Instant,
    val frequency: String
)
