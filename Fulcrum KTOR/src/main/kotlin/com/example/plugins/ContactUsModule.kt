package com.example.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.contactUsModule() {
    routing {
        get("/contact-us") {
            call.respondText("Contact Us")
        }
        get("/about-us") {
            call.respondText("About Us")
        }
    }
}