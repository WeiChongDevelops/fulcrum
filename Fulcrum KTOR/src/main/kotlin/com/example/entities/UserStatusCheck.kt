package com.example.entities

import kotlinx.serialization.Serializable

@Serializable
data class UserStatusCheck(
    val loggedIn: Boolean
)
