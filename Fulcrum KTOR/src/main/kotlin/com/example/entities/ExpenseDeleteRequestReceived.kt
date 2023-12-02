package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseDeleteRequestReceived(
    val expenseId: String
)
