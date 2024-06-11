package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupIdPair(
    val group: String,
    val id: Int
)

@Serializable
data class GroupReorderRequestReceived(
    val reorderedGroupArray: Array<GroupIdPair>
)
