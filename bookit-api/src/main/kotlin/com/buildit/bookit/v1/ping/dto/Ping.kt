package com.buildit.bookit.v1.ping.dto

import com.buildit.bookit.BookitProperties
import com.buildit.bookit.auth.UserPrincipal

/**
 * Ping response
 */
data class Ping(val bookitProperties: BookitProperties, val user: UserPrincipal?, val status: String = "UP")
