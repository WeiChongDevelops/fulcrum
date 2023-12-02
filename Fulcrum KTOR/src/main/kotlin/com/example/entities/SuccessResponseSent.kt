package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class SuccessResponseSent(
    val error: String
)
