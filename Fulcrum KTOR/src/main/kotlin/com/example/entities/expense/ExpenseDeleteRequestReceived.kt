package com.example.entities.expense

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseDeleteRequestReceived(
    val expenseId: String
)
