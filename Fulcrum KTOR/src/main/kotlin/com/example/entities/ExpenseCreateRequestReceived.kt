package com.example.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class ExpenseCreateRequestReceived(
    val expenseId: String,
    val category: String,
    val amount: Double,
    @Contextual val timestamp: Instant
)
