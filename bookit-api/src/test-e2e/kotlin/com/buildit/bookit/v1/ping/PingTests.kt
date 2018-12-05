package com.buildit.bookit.v1.ping

import com.buildit.bookit.Global
import com.winterbe.expekt.expect
import org.json.JSONObject
import org.junit.jupiter.api.Test

/**
 * Test /v1/ping like a black box
 */
class `Ping E2E Tests` {
    @Test
    fun `GET ping`() {
        // act
        val response = Global.REST_TEMPLATE.getForEntity("/v1/ping", String::class.java)

        // assert
        val jsonResponse = JSONObject(response.body)
        val status = jsonResponse.get("status")
        expect(status).to.be.equal("UP")
        expect(jsonResponse.get("user")).to.not.be.`null`
    }

    @Test
    fun `GET ping does not require user`() {
        // act
        val response = Global.ANONYMOUS_REST_TEMPLATE.getForEntity("/v1/ping", String::class.java)

        // assert
        val jsonResponse = JSONObject(response.body)
        val status = jsonResponse.get("status")
        expect(status).to.be.equal("UP")
        expect(jsonResponse.has("user")).to.be.`false`
    }
}
