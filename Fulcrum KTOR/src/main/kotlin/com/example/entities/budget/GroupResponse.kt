package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupResponse(
    val group: String,
    val colour: String
)
