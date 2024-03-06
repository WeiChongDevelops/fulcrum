package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class UserInfo (
    val email: String,
    val password: String
)
