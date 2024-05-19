package com.example.entities.budget

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class GroupCreateRequestSent(
    val userId: String?, // Nullable for registration default db entries
    val group: String,
    val colour: String,
    val id: Int
)
