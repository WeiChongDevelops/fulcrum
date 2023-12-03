package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class BudgetDeleteRequestReceived(
    val category: String
)
