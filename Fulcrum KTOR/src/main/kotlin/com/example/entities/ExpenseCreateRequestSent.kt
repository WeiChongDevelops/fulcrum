package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseCreateRequestSent(
    val userId: String,
    val categoryId: String,
    val amount: Double
)
