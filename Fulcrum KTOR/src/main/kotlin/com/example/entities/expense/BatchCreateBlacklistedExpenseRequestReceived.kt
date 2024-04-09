package com.example.entities.expense

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class BatchCreateBlacklistedExpenseRequestReceived(
    val recurringExpenseId: String,
    @Contextual val timestampsToBlacklist: Array<Instant>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as BatchCreateBlacklistedExpenseRequestReceived

        return timestampsToBlacklist.contentEquals(other.timestampsToBlacklist)
    }

    override fun hashCode(): Int {
        return timestampsToBlacklist.contentHashCode()
    }
}
