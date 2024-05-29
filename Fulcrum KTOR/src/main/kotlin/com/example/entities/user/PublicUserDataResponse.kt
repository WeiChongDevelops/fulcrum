package com.example.entities.user

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class UserPreferencesResponse(
    @Contextual val createdAt: Instant,
    val currency: String,
    val darkModeEnabled: Boolean,
    val accessibilityEnabled: Boolean,
    val profileIconFileName: String
)