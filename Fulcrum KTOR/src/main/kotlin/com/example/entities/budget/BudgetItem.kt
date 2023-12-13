package com.example.entities.budget

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import java.util.*

@Serializable
data class BudgetItem(
    @Contextual val expenseId: UUID,
    @Contextual val userId: UUID,
    @Contextual val categoryId: UUID,
    val amount: Float
)
