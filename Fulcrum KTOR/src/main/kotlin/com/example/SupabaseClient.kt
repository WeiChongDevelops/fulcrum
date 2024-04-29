package com.example

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.postgrest.Postgrest
import io.ktor.client.*
import io.ktor.client.engine.apache5.*
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