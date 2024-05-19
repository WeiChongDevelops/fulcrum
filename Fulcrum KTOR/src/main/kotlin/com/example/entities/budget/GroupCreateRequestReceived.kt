package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupCreateRequestReceived(
    val group: String,
    val colour: String,
    val id: Int
)
