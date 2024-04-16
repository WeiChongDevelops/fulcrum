package com.example.entities.expense

import kotlinx.datetime.Instant
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable

@Serializable
data class ExpenseItemEntity(
    val expenseId: String,
    val category: String,
    val amount: Double,
    @Contextual val timestamp: Instant,
    val recurringExpenseId: String?,
)

@Serializable
data class BatchExpenseCreateRequestReceived(
    val expensesToCreate: Array<ExpenseItemEntity>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as BatchExpenseCreateRequestReceived

        return expensesToCreate.contentEquals(other.expensesToCreate)
    }

    override fun hashCode(): Int {
        return expensesToCreate.contentHashCode()
    }
}
