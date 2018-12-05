package com.buildit.bookit.v1.location.bookable

import com.buildit.bookit.auth.WithMockCustomUser
import com.buildit.bookit.v1.booking.BookingRepository
import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.bookable.dto.Disposition
import com.buildit.bookit.v1.location.dto.Location
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.equalToIgnoringCase
import org.junit.jupiter.api.BeforeEach
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
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter
import java.time.ZoneId

@ExtendWith(SpringExtension::class)
@WebMvcTest(BookableController::class, includeFilters = [ComponentScan.Filter(Configuration::class)])
@WithMockCustomUser
class BookableControllerMockMvcTests @Autowired constructor(
    private val context: WebApplicationContext
) {
    companion object {
        private val location = Location("NYC", ZoneId.of("America/New_York"), "location-guid")
        private val bookable = Bookable(location, "The best bookable ever", Disposition(), "bookable-guid")
    }

    @Autowired
    private lateinit var mvc: MockMvc

    @MockBean
    lateinit var bookableRepo: BookableRepository

    @MockBean
    lateinit var bookingRepo: BookingRepository

    @BeforeEach
    fun configureSecurityFilters() {
        mvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply<DefaultMockMvcBuilder>(SecurityMockMvcConfigurers.springSecurity())
            .build()
    }

    @Test
    fun getExistingBookableTest() {
        mvc.perform(MockMvcRequestBuilders.get("/v1/location/${location.id}/bookable/${bookable.id}"))
            .andExpect(status().isOk)
            .andExpect(jsonPath<String>("$.name", equalToIgnoringCase(bookable.name)))
            .andExpect(jsonPath<Boolean>("$.disposition.closed", equalTo(false)))
    }

    @TestConfiguration
    class InternalConfig {
        @Bean
        fun configurer(): WebMvcConfigurer = object : WebMvcConfigurerAdapter() {
            override fun addFormatters(registry: FormatterRegistry) {
                registry.addConverter(String::class.java, Location::class.java) { id ->
                    when (id) {
                        location.id -> location
                        else -> null
                    }
                }
                registry.addConverter(String::class.java, Bookable::class.java) { id ->
                    when (id) {
                        bookable.id -> bookable
                        else -> null
                    }
                }
            }
        }
    }
}
