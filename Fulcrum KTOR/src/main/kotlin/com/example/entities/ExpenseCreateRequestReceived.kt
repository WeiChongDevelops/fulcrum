package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseCreateRequestReceived(
    val userId: String,
    val category: String,
    val amount: Double
)
