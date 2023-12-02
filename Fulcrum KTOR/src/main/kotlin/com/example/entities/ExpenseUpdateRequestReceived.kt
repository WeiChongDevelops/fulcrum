package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseUpdateRequestReceived(
    val expenseId: String,
    val category: String,
    val amount: Double
)
