package com.example.entities.user

import kotlinx.serialization.Serializable

@Serializable
data class InitialiseDefaultsRequestReceived(
    val userId: String
)
