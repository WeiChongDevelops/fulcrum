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
        configureRouting()
        contactUsModule()
    }.start(wait = true)
}