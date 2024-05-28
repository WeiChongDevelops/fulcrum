package com.example.entities.budget

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class BudgetItemResponse(
    val category: String,
    val amount: Double,
    val iconPath: String,
    val group: String,
    @Contextual val timestamp: Instant,
    val id: Int
)
