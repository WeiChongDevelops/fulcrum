package com.example.entities.recurringExpense

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import kotlinx.datetime.Instant

@Serializable
data class RemovedRecurringExpenseCreateRequestSent (
    val recurringExpenseId: String?,
    @Contextual val timestampOfRemovedInstance: Instant
)
