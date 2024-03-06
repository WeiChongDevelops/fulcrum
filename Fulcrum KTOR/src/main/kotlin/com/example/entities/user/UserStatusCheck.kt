package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class UserStatusCheck(
    val loggedIn: Boolean
)
