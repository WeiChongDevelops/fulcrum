package com.example.entities

import kotlinx.serialization.Serializable
import java.util.*

@Serializable
data class ExpenseItemRequestSent(
    val userId: String,
    val categoryId: String,
    val amount: Double
)
