package com.example.entities.budget

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class GroupItemResponse(
    val group: String,
    val colour: String,
    @Contextual val timestamp: Instant,
    val id: Int
)
