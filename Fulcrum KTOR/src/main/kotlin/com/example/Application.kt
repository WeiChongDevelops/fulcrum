package com.example

import com.example.plugins.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.coroutines.launch


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
    embeddedServer(Netty, port = 8080, host = "localhost") {
        serverConfig()
    }.start(wait = true)
}

private fun Application.serverConfig() {
    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Put)
        // Add other methods as needed

        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        // Add other headers as needed

        allowCredentials = true
        allowNonSimpleContentTypes = true

        allowHost("localhost:5173", schemes = listOf("http"))
        // Add other hosts as needed
    }

    staticResources()
    contactUsModule()
    launch {
        configureRouting()
    }
}

