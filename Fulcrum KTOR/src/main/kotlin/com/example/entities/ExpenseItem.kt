package com.example.entities

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.util.*

@Serializable
data class ExpenseItem(
    @Contextual val expenseId: UUID,
    @Contextual val userId: UUID,
    @Contextual val categoryId: UUID,
    val amount: Float,
    @Contextual val timestamp: Date,
)
