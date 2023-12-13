package com.example.entities.budget

import io.ktor.http.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

@Serializable
data class Temp(
    val body: JsonElement?,
    val header: Headers
)
