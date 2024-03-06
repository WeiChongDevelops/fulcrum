package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class BudgetDeleteRequestReceived(
    val category: String
)
