package com.buildit.bookit

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.crypto.MACSigner
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.client.ClientHttpRequestInterceptor
import java.util.Base64
import javax.xml.bind.DatatypeConverter

fun String.toEntity(): HttpEntity<String> {
    val headers = HttpHeaders()
    headers.contentType = MediaType.APPLICATION_JSON

    return HttpEntity(trimIndent(), headers)
}

object Global {
    val URI = System.getenv("ENDPOINT_URI") ?: "http://localhost:8080"
    val BASIC_AUTH_REST_TEMPLATE =
        TestRestTemplate(RestTemplateBuilder().rootUri(URI).basicAuthorization("admin", "password").build())
    val ANONYMOUS_REST_TEMPLATE = TestRestTemplate(RestTemplateBuilder().rootUri(URI).build())
    const val FAKE_OID = "9e14c6ff-764e-4bd7-96f6-1d4bc2593a3e"
    private val signer =
        MACSigner(DatatypeConverter.parseBase64Binary(Base64.getEncoder().encodeToString("secretsecretsecretsecretsecretsecret".toByteArray())))
    val BEARER_AUTH_REST_TEMPLATE =
        TestRestTemplate(RestTemplateBuilder().rootUri(URI).additionalInterceptors(ClientHttpRequestInterceptor { request, body, execution ->
            val claimsSet = JWTClaimsSet.Builder()
                .subject("fakeuser")
                .claim("oid", FAKE_OID)
                .claim("given_name", "Fake")
                .claim("family_name", "Auth User")
                .build()
            val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claimsSet)
            jwt.sign(signer)
            request.headers["Authorization"] = "Bearer ${jwt.serialize()}"
            execution.execute(request, body)
        }).build())
    const val ANOTHER_FAKE_OID = "b6263c2f-7e05-47cd-a75d-3181a9edd450"
    val ANOTHER_USER_REST_TEMPLATE =
        TestRestTemplate(RestTemplateBuilder().rootUri(URI).additionalInterceptors(ClientHttpRequestInterceptor { request, body, execution ->
            val claimsSet = JWTClaimsSet.Builder()
                .subject("anotherfakeuser")
                .claim("oid", ANOTHER_FAKE_OID)
                .claim("given_name", "Another")
                .claim("family_name", "Fake User")
                .build()
            val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claimsSet)
            jwt.sign(signer)
            request.headers["Authorization"] = "Bearer ${jwt.serialize()}"
            execution.execute(request, body)
        }).build())
    val REST_TEMPLATE = BEARER_AUTH_REST_TEMPLATE
}
