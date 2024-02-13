package com.example.entities.expense

import kotlinx.serialization.Serializable

@Serializable
data class BatchExpenseDeleteRequestReceived(
    val expenseIdsToDelete: Array<String>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as BatchExpenseDeleteRequestReceived

        return expenseIdsToDelete.contentEquals(other.expenseIdsToDelete)
    }

    override fun hashCode(): Int {
        return expenseIdsToDelete.contentHashCode()
    }
}
