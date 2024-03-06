package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class IncomeCreateRequestSent(
    val userId: String,
    val totalIncome: Double
)
