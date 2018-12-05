package com.buildit.bookit.auth

import com.buildit.bookit.Global
import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.crypto.MACSigner
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import com.nimbusds.jwt.SignedJWT
import com.winterbe.expekt.expect
import org.json.JSONObject
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.http.client.ClientHttpRequestInterceptor
import java.util.Base64
import java.util.Date
import javax.xml.bind.DatatypeConverter

/**
 * Test security
 */
class `Security E2E Tests` {
    private val testRestTemplate = TestRestTemplate(RestTemplateBuilder().rootUri(Global.URI).build())
    private val signer =
        MACSigner(DatatypeConverter.parseBase64Binary(Base64.getEncoder().encodeToString("secretsecretsecretsecretsecretsecret".toByteArray())))

    @BeforeEach
    fun `clear interceptors`() {
        testRestTemplate.restTemplate.interceptors.clear()
    }

    @Nested
    inner class `auth header with` {
        @Test
        fun `unparsable token`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                request.headers["Authorization"] = "Bearer FooBarBaz"
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(UNAUTHORIZED)
        }

        @Test
        fun `blank token`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                request.headers["Authorization"] = "Bearer "
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(UNAUTHORIZED)
        }
    }

    @Nested
    inner class `jwt that has` {
        @Test
        fun `no signature`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                val claimSet = JWTClaimsSet.Builder()
                    .subject("fakeuser")
                    .build()
                val jwt = PlainJWT(claimSet).serialize()
                request.headers["Authorization"] = "Bearer $jwt"
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(UNAUTHORIZED)
        }

        @Test
        fun `invalid signature`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                val claimSet = JWTClaimsSet.Builder()
                    .subject("fakeuser")
                    .build()
                val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claimSet)
                jwt.sign(signer)

                request.headers["Authorization"] = "Bearer ${jwt.serialize().dropLast(1)}"
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(UNAUTHORIZED)
        }

        @Test
        fun `expired`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                val claimSet = JWTClaimsSet.Builder()
                    .subject("fakeuser")
                    .expirationTime(Date(System.currentTimeMillis() - 3600000))
                    .build()
                val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claimSet)
                jwt.sign(signer)

                request.headers["Authorization"] = "Bearer ${jwt.serialize()}"
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(UNAUTHORIZED)
        }

        @Test
        fun `not-before in future`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                val claimSet = JWTClaimsSet.Builder()
                    .subject("fakeuser")
                    .notBeforeTime(Date(System.currentTimeMillis() + 3600000))
                    .build()
                val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claimSet)
                jwt.sign(signer)

                request.headers["Authorization"] = "Bearer ${jwt.serialize()}"
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(UNAUTHORIZED)
        }

        @Test
        fun `bad token behaves as anonymous on selected endpoints`() {
            testRestTemplate.restTemplate.interceptors.add(ClientHttpRequestInterceptor { request, body, execution ->
                val claimSet = JWTClaimsSet.Builder()
                    .subject("fakeuser")
                    .build()
                val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claimSet)
                jwt.sign(signer)
                request.headers["Authorization"] = "Bearer ${jwt.serialize().drop(1)}"
                execution.execute(request, body)
            })

            val response = testRestTemplate.getForEntity("/v1/ping", String::class.java)

            expect(response.statusCode).to.equal(OK)
            expect(JSONObject(response.body).has("user")).to.be.`false`
        }
    }


    @Nested
    inner class `basic auth` {
        @Test
        fun `against API`() {
            val response = Global.BASIC_AUTH_REST_TEMPLATE.getForEntity("/v1/location", String::class.java)

            expect(response.statusCode).to.equal(OK)
        }

        @Test
        fun `against Actuator`() {
            val response = Global.BASIC_AUTH_REST_TEMPLATE.getForEntity("/management/env", String::class.java)

            expect(response.statusCode).to.equal(OK)
        }
    }

    @Test
    fun `bearer auth against Actuator fails`() {
        val response = Global.BEARER_AUTH_REST_TEMPLATE.getForEntity("/management/env", String::class.java)

        expect(response.statusCode).to.equal(UNAUTHORIZED)
    }

    @Test
    fun `anonymous auth against Actuator fails`() {
        val response = Global.ANONYMOUS_REST_TEMPLATE.getForEntity("/management/env", String::class.java)

        expect(response.statusCode).to.equal(UNAUTHORIZED)
    }
}
