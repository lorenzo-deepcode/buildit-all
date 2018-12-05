package com.buildit.bookit.v1.booking

import com.buildit.bookit.auth.WithMockCustomUser
import com.buildit.bookit.auth.makeUser
import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.booking.dto.BookingRequest
import com.buildit.bookit.v1.location.bookable.BookableRepository
import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.bookable.dto.Disposition
import com.buildit.bookit.v1.location.dto.Location
import com.buildit.bookit.v1.user.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.reset
import com.nhaarman.mockito_kotlin.whenever
import org.hamcrest.Matchers.equalToIgnoringCase
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.format.FormatterRegistry
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter
import java.time.LocalDateTime.now
import java.time.ZoneId
import java.time.temporal.ChronoUnit

/**
 * Booking controller spring mvc integration tests
 */
@ExtendWith(SpringExtension::class)
@WebMvcTest(BookingController::class, includeFilters = [ComponentScan.Filter(Configuration::class)])
@WithMockCustomUser
class BookingControllerMockMvcTests @Autowired constructor(
    private val context: WebApplicationContext,
    private val mapper: ObjectMapper
) {
    @WithMockCustomUser
    companion object {
        private val user = makeUser()
        private val NYC_TZ = ZoneId.of("America/New_York")
        private val startDateTime = now(NYC_TZ).plusHours(1).truncatedTo(ChronoUnit.MINUTES)
        private val endDateTime = now(NYC_TZ).plusHours(2).truncatedTo(ChronoUnit.MINUTES)
        private val location = Location("NYC", NYC_TZ, "guid")
        private val bookable = Bookable(location, "Foo", Disposition(), "guid")

        private val booking = Booking(
            bookable,
            "The Booking",
            startDateTime,
            endDateTime,
            user,
            "guid"
        )
    }

    @Autowired
    private lateinit var mvc: MockMvc

    @MockBean
    lateinit var bookingRepo: BookingRepository

    @MockBean
    lateinit var bookableRepo: BookableRepository

    @MockBean
    lateinit var userService: UserService

    @BeforeEach
    fun configureSecurityFilters() {
        mvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity())
            .build()
    }

    @AfterEach
    fun resetMocks() {
        reset(bookingRepo)
        reset(bookableRepo)
        reset(userService)
    }

    @Nested
    @WithMockCustomUser
    inner class GetBooking {

        @BeforeEach
        fun setupMock() {
            whenever(bookingRepo.findOne(booking.id))
                .doReturn(listOf(booking))
        }

        @Test
        fun `existing booking is returned`() {
            mvc.perform(get("/v1/booking/guid"))
                .andExpect(status().isOk)
                .andExpect(jsonPath<String>("$.subject", equalToIgnoringCase("The Booking")))
                .andExpect(jsonPath<String>("$.user.name", equalToIgnoringCase("Fake User")))
                .andExpect(jsonPath<String>("$.user.externalId", equalToIgnoringCase("456xyz")))
        }
    }

    @Test
    @WithMockCustomUser
    fun `nonexistent booking is not found`() {
        mvc.perform(get("/v1/booking/999"))
            .andExpect(status().isNotFound)
    }

    @Nested
    @WithMockCustomUser
    inner class CreateBooking {
        private val subject = "New Meeting"

        @BeforeEach
        fun createMock() {
            val booking = Booking(bookable, subject, startDateTime, endDateTime, user)
            whenever(bookingRepo.save(booking))
                .doReturn(booking)
            whenever(bookableRepo.findOne(bookable.id))
                .doReturn(listOf(bookable))
        }

        @Test
        fun `valid booking is created`() {
            whenever(userService.register(any())).doReturn(user)

            val request = BookingRequest(bookable.id, subject, startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isCreated)
                .andExpect(jsonPath<String>("$.subject", equalToIgnoringCase(subject)))
                .andExpect(jsonPath<String>("$.start", equalToIgnoringCase(startDateTime.toString())))
                .andExpect(jsonPath<String>("$.end", equalToIgnoringCase(endDateTime.toString())))
                .andExpect(jsonPath<String>("$.user.id", equalToIgnoringCase("123abc")))
                .andExpect(jsonPath<String>("$.user.name", equalToIgnoringCase("Fake User")))
                .andExpect(jsonPath<String>("$.user.externalId", equalToIgnoringCase("456xyz")))
        }

        @Test
        fun `booking must be in future`() {
            val startDateTime = now(NYC_TZ).minusHours(1)
            val endDateTime = startDateTime.plusHours(1)
            val request = BookingRequest(bookable.id, subject, startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking start must precede end`() {
            val startDateTime = now(NYC_TZ).plusHours(1)
            val endDateTime = startDateTime.minusHours(1)
            val request = BookingRequest(bookable.id, subject, startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking requires existing bookable`() {
            val request = BookingRequest(null, subject, startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking must have non-null subject`() {
            val request = BookingRequest(bookable.id, null, startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking must have non-blank subject`() {
            val request = BookingRequest(bookable.id, "  ", startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking must have non-empty subject`() {
            val request = BookingRequest(bookable.id, "", startDateTime, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking must have start`() {
            val request = BookingRequest(bookable.id, subject, null, endDateTime)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        @Test
        fun `booking must have end`() {
            val request = BookingRequest(bookable.id, subject, startDateTime, null)

            mvc.perform(post(request))
                .andExpect(status().isBadRequest)
        }

        private fun post(request: BookingRequest): MockHttpServletRequestBuilder? =
            post("/v1/booking")
                .contentType(APPLICATION_JSON)
                .content(mapper.writeValueAsString(request))
    }

    @Test
    fun `nonexistent booking is deleted`() {
        mvc.perform(delete("/v1/booking/999"))
            .andExpect(status().isNoContent)
    }

    @TestConfiguration
    class InternalConfig {
        @Bean
        fun configurer(): WebMvcConfigurer = object : WebMvcConfigurerAdapter() {
            override fun addFormatters(registry: FormatterRegistry) {
                registry.addConverter(String::class.java, Booking::class.java) { id ->
                    when (id) {
                        BookingControllerMockMvcTests.booking.id -> BookingControllerMockMvcTests.booking
                        else -> null
                    }
                }
            }
        }
    }
}
