package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class UserEmailOrNull(
    val email: String?
)
