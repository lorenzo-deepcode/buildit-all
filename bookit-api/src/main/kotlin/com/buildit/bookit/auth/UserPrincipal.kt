package com.buildit.bookit.auth

data class UserPrincipal(
    val subject: String,
    val givenName: String,
    val familyName: String
)
