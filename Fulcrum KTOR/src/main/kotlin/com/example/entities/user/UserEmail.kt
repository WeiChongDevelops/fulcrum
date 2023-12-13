package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class UserEmail(
    val email: String
)
