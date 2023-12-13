package com.example.entities.successFeedback

import kotlinx.serialization.Serializable

@Serializable
data class SuccessResponseSent(
    val success: String
)
