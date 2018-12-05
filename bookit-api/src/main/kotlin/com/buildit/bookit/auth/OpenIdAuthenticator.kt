package com.buildit.bookit.auth

import com.buildit.bookit.BookitProperties
import com.nimbusds.jose.proc.SecurityContext
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.proc.JWTProcessor
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import javax.servlet.http.HttpServletRequest

interface JwtAuthenticator {
    fun getAuthentication(jwtToken: String, request: HttpServletRequest): UsernamePasswordAuthenticationToken?
}

class BookitSecurityContext(private val request: HttpServletRequest) : SecurityContext {
    private val log = LoggerFactory.getLogger(this::class.java)
    fun allowFakeTokens(props: BookitProperties): Boolean {
        val subdomain = request.serverName.split('.')[0]
        val isNonProdEnvironment = listOf("localhost", "integration").any { subdomain.contains(it) }
        val allowFakeTokens = props.allowTestTokens ?: isNonProdEnvironment
        if (allowFakeTokens) log.info("props.allowTestTokens: ${props.allowTestTokens}, non-prod environment: $isNonProdEnvironment")
        return allowFakeTokens
    }
}

class OpenIdAuthenticator(private val jwtProcessor: JWTProcessor<BookitSecurityContext>) : JwtAuthenticator {
    private val log = LoggerFactory.getLogger(this::class.java)

    @Suppress("TooGenericExceptionCaught")
    override fun getAuthentication(
        jwtToken: String,
        request: HttpServletRequest
    ): UsernamePasswordAuthenticationToken? {
        val user: JWTClaimsSet? = try {
            jwtProcessor.process(jwtToken, BookitSecurityContext(request))
        } catch (e: Throwable) {
            log.info("Unable to parse token", e)
            null
        }

        if (user != null) {
            log.info("Request token verification success: $user")
            return UsernamePasswordAuthenticationToken(
                UserPrincipal(
                    user.getStringClaim("oid") ?: user.subject,
                    user.getStringClaim("given_name") ?: "",
                    user.getStringClaim("family_name") ?: user.getStringClaim("name") ?: user.subject
                ), null, emptyList()
            )
        }

        log.info("Request token verification failure.")
        return null
    }
}
