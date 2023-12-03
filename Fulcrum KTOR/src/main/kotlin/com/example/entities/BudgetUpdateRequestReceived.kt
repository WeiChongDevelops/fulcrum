package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class BudgetUpdateRequestReceived(
    val category: String,
    val amount: Double
)
