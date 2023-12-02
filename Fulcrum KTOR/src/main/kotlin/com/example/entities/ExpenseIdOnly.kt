package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseIdOnly(
    val expenseId: String
)
