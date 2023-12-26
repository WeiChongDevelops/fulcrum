package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupUpdateRequestReceived(
    val originalGroupName: String,
    val newGroupName: String,
    val newColour: String
)
