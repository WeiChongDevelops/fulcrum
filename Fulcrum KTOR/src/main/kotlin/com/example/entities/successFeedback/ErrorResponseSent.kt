package com.example.entities.successFeedback

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponseSent(
    val error: String
)
