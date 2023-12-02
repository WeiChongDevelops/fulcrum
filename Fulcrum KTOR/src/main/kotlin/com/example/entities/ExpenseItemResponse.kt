package com.example.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.time.OffsetDateTime

@Serializable
data class ExpenseItemResponse(
    val expenseId: String,
    val userId: String,
    val category: String,
    val amount: Double,
    @Contextual val timestamp: Instant,
)
