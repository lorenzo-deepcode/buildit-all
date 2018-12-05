package com.buildit.bookit.auth

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.times
import com.nhaarman.mockito_kotlin.verify
import com.winterbe.expekt.expect
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import javax.servlet.FilterChain

class JwtAuthenticationFilterUnitTests {
    private val goodSpringAuthToken = UsernamePasswordAuthenticationToken("principal", "credentials")
    private val nullSpringAuthToken: UsernamePasswordAuthenticationToken? = null

    private val filterChain: FilterChain = mock()

    private lateinit var request: MockHttpServletRequest
    private lateinit var response: MockHttpServletResponse

    @BeforeEach
    fun `set up`() {
        request = MockHttpServletRequest()
        response = MockHttpServletResponse()
    }

    @Nested
    inner class `with well-formed header` {
        @Test
        fun `successful verification`() {
            request.addHeader("Authorization", "Bearer test")

            val jwtAuthenticator = mock<JwtAuthenticator> {
                on { getAuthentication("test", request) }
                    .doReturn(goodSpringAuthToken)
            }

            val filter = JwtAuthenticationFilter(mock {}, jwtAuthenticator)
            filter.doFilter(request, response, filterChain)
            expect(SecurityContextHolder.getContext().authentication).to.equal(goodSpringAuthToken)
            verify(filterChain, times(1)).doFilter(request, response)
        }

        @Test
        fun `non-successful verification`() {
            request.addHeader("Authorization", "Bearer test")

            val jwtAuthenticator = mock<JwtAuthenticator> {
                on { getAuthentication("test", request) }
                    .doReturn(nullSpringAuthToken)
            }

            val filter = JwtAuthenticationFilter(mock {}, jwtAuthenticator)
            filter.doFilter(request, response, filterChain)
            expect(SecurityContextHolder.getContext().authentication).to.equal(nullSpringAuthToken)
            verify(filterChain, times(1)).doFilter(request, response)
        }
    }

    @Nested
    inner class `with malformed header` {
        @Test
        fun `no auth header`() {
            val filter = JwtAuthenticationFilter(mock {}, mock {})
            filter.doFilter(request, response, filterChain)
            expect(SecurityContextHolder.getContext().authentication).to.be.`null`
            verify(filterChain, times(1)).doFilter(request, response)
        }

        @Test
        fun `not a bearer token`() {
            request.addHeader("Authorization", "NotBearer test")

            val filter = JwtAuthenticationFilter(mock {}, mock {})
            filter.doFilter(request, response, filterChain)
            expect(SecurityContextHolder.getContext().authentication).to.be.`null`
            verify(filterChain, times(1)).doFilter(request, response)
        }

        @Test
        fun `no bearer token value`() {
            request.addHeader("Authorization", "Bearer  ")

            val filter = JwtAuthenticationFilter(mock {}, mock {})
            filter.doFilter(request, response, filterChain)
            expect(SecurityContextHolder.getContext().authentication).to.be.`null`
            verify(filterChain, times(1)).doFilter(request, response)
        }
    }
}
