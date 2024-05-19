package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupReorderRequestReceived(
    val reorderedGroupArray: Array<GroupItemResponse>
)
