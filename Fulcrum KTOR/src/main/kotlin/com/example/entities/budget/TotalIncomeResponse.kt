package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class TotalIncomeResponse(
    val totalIncome: Double
)
