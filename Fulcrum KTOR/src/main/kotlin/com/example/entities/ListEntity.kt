package com.example.entities

import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

object ListEntity: Table<Nothing>("note") {
    val id = int("id").primaryKey()
    val note = varchar("note")
}