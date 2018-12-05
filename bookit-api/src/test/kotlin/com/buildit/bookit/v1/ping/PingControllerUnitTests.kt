package com.buildit.bookit.v1.ping

import com.buildit.bookit.BookitProperties
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class PingControllerUnitTests {

    @Nested
    inner class `v1|ping` {
        @Nested
        inner class `get` {
            @Test
            fun `should return status UP`() {
                val pingController = PingController(BookitProperties())
                expect(pingController.ping().status).to.be.equal("UP")
            }
        }
    }
}
