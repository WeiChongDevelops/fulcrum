package com.example.entities

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.sql.Timestamp
import java.util.*

@Serializable
data class ExpenseItemResponse(
    val expenseId: String,
    val userId: String,
    val categoryId: String,
    val amount: Double,
    @Contextual val timestamp: Timestamp,
)
