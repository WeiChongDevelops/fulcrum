package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class OAuthLoginAttemptRequest(
    val accessToken: String,
    val refreshToken: String
)