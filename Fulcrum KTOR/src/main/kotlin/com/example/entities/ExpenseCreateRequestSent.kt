package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseCreateRequestSent(
    val userId: String,
    val category: String,
    val amount: Double
)
