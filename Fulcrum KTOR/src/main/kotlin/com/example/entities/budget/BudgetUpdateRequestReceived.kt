package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class BudgetUpdateRequestReceived(
    val category: String,
    val amount: Double?,
    val group: String?,
    val iconPath: String?
)
