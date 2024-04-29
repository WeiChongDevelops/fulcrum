package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class OAuthLoginPromptRequestReceived(
    val provider: String,
    val urlOrigin: String
)
