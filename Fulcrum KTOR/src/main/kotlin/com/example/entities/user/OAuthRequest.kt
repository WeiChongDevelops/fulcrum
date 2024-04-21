package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class OAuthRequest(
    val jwt: String
)
