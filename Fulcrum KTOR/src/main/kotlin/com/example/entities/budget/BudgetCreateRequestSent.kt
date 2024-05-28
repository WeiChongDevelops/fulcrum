package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class BudgetCreateRequestSent(
    val userId: String,
    val category: String,
    val amount: Double,
    val iconPath: String,
    val group: String,
    val id: Int
)
