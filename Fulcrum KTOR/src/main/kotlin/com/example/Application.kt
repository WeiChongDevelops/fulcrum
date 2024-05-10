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

const val PORT = 8080;

private fun Application.serverConfig() {
    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Put)

        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)

        allowCredentials = true
        allowNonSimpleContentTypes = true

        allowHost("frontend", schemes = listOf("http"))
        allowHost("frontend:3001", schemes = listOf("http"))

        allowHost("localhost", schemes = listOf("http"))
        allowHost("localhost:3001", schemes = listOf("http"))
    }

    launch {
        configureAuthRouting()
        configureBudgetRouting()
        configureExpenseRouting()
        configureOtherRouting()
    }
}


fun main() {
    println("Server running on port $PORT")
    embeddedServer(Netty, port = PORT, host = "0.0.0.0") {
        serverConfig()
    }.start(wait = true)
}
