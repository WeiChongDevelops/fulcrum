package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class BudgetTotalResponse(
    val total: Double
)
