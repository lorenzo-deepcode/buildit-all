package com.buildit.bookit.auth

import com.buildit.bookit.BookitProperties
import com.winterbe.expekt.expect
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest

internal class BookitSecurityContextTest {
    private lateinit var request: MockHttpServletRequest

    @BeforeEach
    fun `set up`() {
        request = MockHttpServletRequest()
    }

    @Test
    fun `disallow fake tokens if property set to false`() {
        val props = BookitProperties(false)
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(false)
    }

    @Test
    fun `allow fake tokens if property set to true`() {
        val props = BookitProperties(true)
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(true)
    }

    @Test
    fun `allow fake tokens if server is localhost`() {
        val props = BookitProperties(null)
        request.serverName = "localhost.foo.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(true)
    }

    @Test
    fun `allow fake tokens if server is integration`() {
        val props = BookitProperties(null)
        request.serverName = "integration.foo.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(true)
    }

    @Test
    fun `allow fake tokens if subdomain contains integration (embedded)`() {
        val props = BookitProperties(null)
        request.serverName = "my-integration.foo.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(true)
    }

    @Test
    fun `disallow fake tokens if integration is not in subdomain (embedded)`() {
        val props = BookitProperties(null)
        request.serverName = "host.integration.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(false)
    }

    @Test
    fun `disallow fake tokens if server is not integration or localhost`() {
        val props = BookitProperties(null)
        request.serverName = "someproductionserver.foo.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(false)
    }

    @Test
    fun `disallow fake tokens even though server is integration (property takes precedence)`() {
        val props = BookitProperties(false)
        request.serverName = "integration.foo.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(false)
    }

    @Test
    fun `disallow fake tokens if even if integration is in subdomain (property takes precedence)`() {
        val props = BookitProperties(false)
        request.serverName = "my-integration.foo.com"
        expect(BookitSecurityContext(request).allowFakeTokens(props)).to.equal(false)
    }
}
