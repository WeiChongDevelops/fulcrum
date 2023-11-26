package com.example.plugins

import io.ktor.http.*
import io.ktor.http.ContentDisposition.Companion.File
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.io.File

fun Application.configureRouting() {
    routing {
        get("/") {
//            println("URI: ${call.request.uri}") // "/"
//            println("Headers: ${call.request.headers.names()}")
//            println("User-Agent: ${call.request.headers["User-Agent"]}")
//            println("Host: ${call.request.headers["Host"]}")
//            println("Connection: ${call.request.headers["Connection"]}")
//            println("Query Parameters: ${call.request.queryParameters.names()}")
//            println("Username: ${call.request.queryParameters["usr"]}")
//            println("Password: ${call.request.queryParameters["pw"]}")
            call.respondText("Front Website Here")
        }

        get("/app") {
            call.respondText("App Here")
        }

        get("/login") {
            call.respondText("Login Here")
        }

        get("/signup") {
            call.respondText("Sign Up Here")
        }

        get("/app/expenses") {
            call.respondText("Expenses Here")
        }

        get("/app/budget") {
            call.respondText("Budget Here")
        }

        get("app/tools") {
            call.respondText("Tools Here")
        }

//        get("/blog/{page}") {
//            val pageNumber = call.parameters["page"]
//            call.respondText("You are on page $pageNumber")
//        }
//
//        post("/login") {
//            val userInfo = call.receive<UserInfo>()
//            println(userInfo)
//            call.respondText("Post request functional.")
//        }
//
//        get("/json") {
//            val myJSON = UserInfo("123@123.com", "pwpwpw")
//            call.respond(myJSON);
//        }
//
//        get("/headers") {
//            call.response.headers.append("fruit", "orange")
//            call.respondText("Extra header attached.")
//        }
//
//        get("/fileDownload") {
//            val file = File("iris.jpg")
//
//            call.response.header(
//                HttpHeaders.ContentDisposition,
//                ContentDisposition.Attachment.withParameter(
//                    ContentDisposition.Parameters.FileName, "openImage.jpg"
//                ).toString()
//            )
//            call.respondFile(file)
//        }
//
//
//        get("/fileOpen") {
//            val file = File("iris.jpg")
//
//            call.response.header(
//                HttpHeaders.ContentDisposition,
//                ContentDisposition.Inline.withParameter(
//                    ContentDisposition.Parameters.FileName, "openImage.jpg"
//                ).toString()
//            )
//            call.respondFile(file)
//        }
    }
}

@Serializable
data class UserInfo (
    val email: String,
    val password: String
)