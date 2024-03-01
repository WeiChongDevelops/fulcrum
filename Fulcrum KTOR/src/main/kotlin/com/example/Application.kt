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

        allowHost("localhost:5173", schemes = listOf("http"))
    }

    launch {
        configureAuthRouting()
        configureBudgetRouting()
        configureExpenseRouting()
        configureOtherRouting()
    }
}


fun main() {
    embeddedServer(Netty, port = 8080, host = "localhost") {
        serverConfig()
    }.start(wait = true)
}
