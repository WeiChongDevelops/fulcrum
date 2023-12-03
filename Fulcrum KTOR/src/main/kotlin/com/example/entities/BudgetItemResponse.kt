package com.example.entities

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class BudgetItemResponse(
    val userId: String,
    val category: String,
    val amount: Double,
)
