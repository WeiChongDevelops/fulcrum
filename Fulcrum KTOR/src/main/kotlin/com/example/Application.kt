package com.example

import com.example.plugins.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import org.ktorm.database.Database
import org.ktorm.dsl.*
import com.example.entities.ListEntity

//fun main() {
//    embeddedServer(Netty, port=8080, host="localhost") {
//        install(Routing) {
//            homeRoute()
//        }
//    }.start(wait = true)
//}
//
//fun Routing.homeRoute() {
//    get("/") {
//        call.respond("Hello Ktor.")
//    }
//}

fun main() {
//    System.setProperty("io.ktor.development", "true")
    embeddedServer(Netty, port=8080, host="localhost") {
        install(ContentNegotiation) {
            json()
        }
        staticResources()
        configureRouting()
        contactUsModule()

//        val database = Database.connect(
//            url = "jdbc:mysql://localhost:3306/notes",
//            driver = "com.mysql.cj.jdbc.Driver",
//            user = "root",
//            password = "fAbrication!23"
//        )
//
////        database.insert(NotesEntity) {
////            set(it.note, "Apple")
////        }
////
////        database.insert(NotesEntity) {
////            set(it.note, "Orange")
////        }
////
////        database.insert(NotesEntity) {
////            set(it.note, "Banana")
////        }
//        database.update(ListEntity) {
//            set(it.note, "Replacement Value")
//            where {
//                it.id eq 1
//            }
//        }
//
//        database.delete(ListEntity) {
//            it.id eq 1
//        }
//
//        var notes = database.from(ListEntity)
//            .select()
//        for(row in notes) {
//            println("${row[ListEntity.id]},${row[ListEntity.note]}")
//        }
    }.start(wait = true)
}