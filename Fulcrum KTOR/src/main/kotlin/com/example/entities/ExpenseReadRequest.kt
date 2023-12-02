package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class ExpenseReadRequest(
    val userId: String
)
