package com.example.entities.budget

import kotlinx.serialization.Serializable

@Serializable
data class GroupDeleteRequestReceived(
    val group: String,
    val keepContainedBudgets: Boolean
)
