package com.example.entities

import kotlinx.serialization.Serializable
import java.util.*

@Serializable
data class ExpenseItemRequestReceived(
    val userId: String,
    val category: String,
    val amount: Double
)
