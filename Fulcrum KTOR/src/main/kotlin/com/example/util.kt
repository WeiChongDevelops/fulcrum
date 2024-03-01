package com.example

import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.postgrest.Postgrest
import io.ktor.client.*
import io.ktor.client.engine.apache5.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import org.apache.hc.core5.http.HttpHost

object SupabaseClient {
    private const val SUPABASE_URL = "https://pdtitoimxnivxfswjhty.supabase.co"
    private val supabaseKey = System.getenv("SUPABASE_KEY")
    val supabase = createSupabaseClient(SUPABASE_URL, supabaseKey) {
        install(Postgrest)
        install(GoTrue)
        val client = HttpClient(Apache5) {
            engine {
                followRedirects = true
                socketTimeout = 10_000
                connectTimeout = 10_000
                connectionRequestTimeout = 20_000
                customizeClient {
                    setProxy(HttpHost("127.0.0.1", 8080))
                }
            }
        }
    }
}

suspend fun getActiveUserId(): String {
    return SupabaseClient.supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id
}

suspend fun ApplicationCall.respondSuccess(message: String) {
    respond(HttpStatusCode.OK, SuccessResponseSent(message))
}

suspend fun ApplicationCall.respondError(message: String) {
    respond(HttpStatusCode.BadRequest, ErrorResponseSent(message))
}