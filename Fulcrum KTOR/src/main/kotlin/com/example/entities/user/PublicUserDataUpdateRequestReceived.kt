package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class PublicUserDataUpdateRequestReceived(
    val currency: String,
    val darkModeEnabled: Boolean,
    val accessibilityEnabled: Boolean
)
