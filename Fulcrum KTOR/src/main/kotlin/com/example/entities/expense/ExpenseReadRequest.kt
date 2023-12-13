package com.example.entities.expense

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseReadRequest(
    val userId: String
)
