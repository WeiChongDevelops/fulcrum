package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupCreateRequestSent(
    val userId: String,
    val group: String,
    val colour: String
)
