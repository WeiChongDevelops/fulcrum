package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class TotalIncomeUpdateRequestReceived(
    val totalIncome: Double
)
