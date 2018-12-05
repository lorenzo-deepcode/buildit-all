package com.buildit.bookit.v1.booking

import com.buildit.bookit.Global
import com.buildit.bookit.toEntity
import com.natpryce.hamkrest.assertion.assertThat
import com.natpryce.hamkrest.throws
import com.winterbe.expekt.expect
import org.json.JSONObject
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.skyscreamer.jsonassert.JSONAssert
import org.skyscreamer.jsonassert.JSONCompareMode
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.FORBIDDEN
import org.springframework.http.ResponseEntity
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/**
 * Test /v1/booking like a black box
 */
class `Booking E2E Tests` {
    private val now: LocalDateTime = LocalDateTime.now(ZoneId.of("America/New_York"))
    private val yesterday: LocalDateTime = now.minusDays(1)
    private val tomorrow: LocalDateTime = now.plusDays(1)
    private val tomorrowPlusAnHour = tomorrow.plusHours(1)
    private val dayAfterTomorrow: LocalDateTime = tomorrow.plusDays(2)

    private var response: ResponseEntity<String>? = null
    private val bookingForTomorrow =
        """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "My new meeting",
                    "start": "$tomorrow",
                    "end": "$tomorrowPlusAnHour"
                }
                """

    @Nested
    inner class `Get bookings` {
        @Nested
        inner class `valid` {
            private val expectedBooking = """
                        {
                            "bookable": {
                                "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8"
                            },
                            "subject": "My new meeting",
                            "user": {
                              "name": "Fake Auth User",
                              "externalId": "${Global.FAKE_OID}"
                            }
                        }
                    """.trimIndent()
            private val expectedBookings = "[$expectedBooking]"

            private val otherUserExpectedBooking = """
                        {
                            "bookable": {
                                "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8"
                            },
                            "subject": "**********",
                            "user": {
                              "name": "Fake Auth User",
                              "externalId": "${Global.FAKE_OID}"
                            }
                        }
                    """.trimIndent()
            private val otherUserExpectedBookings = "[$otherUserExpectedBooking]"

            private val noBooking = """
                        [ ]
                    """.trimIndent()

            @BeforeEach
            fun `put booking in place`() {
                response = post(bookingForTomorrow, "/v1/booking")
                expect(response?.statusCode?.is2xxSuccessful).to.be.`true`
            }

            @Test
            fun `get with no params returns bookings`() {
                val response = get("/v1/booking")
                JSONAssert.assertEquals(expectedBookings, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `overlapping start date returns bookings`() {
                val start = DateTimeFormatter.ISO_LOCAL_DATE.format(now)
                val response = get("/v1/booking?start=$start")
                JSONAssert.assertEquals(expectedBookings, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `overlapping end date returns bookings`() {
                val end = DateTimeFormatter.ISO_LOCAL_DATE.format(dayAfterTomorrow)
                val response = get("/v1/booking?end=$end")
                JSONAssert.assertEquals(expectedBookings, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `overlapping start and end date returns bookings`() {
                val start = DateTimeFormatter.ISO_LOCAL_DATE.format(now)
                val end = DateTimeFormatter.ISO_LOCAL_DATE.format(dayAfterTomorrow)
                val response = get("/v1/booking?start=$start&end=$end")
                JSONAssert.assertEquals(expectedBookings, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `non-overlapping start date returns no bookings `() {
                val start = DateTimeFormatter.ISO_LOCAL_DATE.format(dayAfterTomorrow)
                val response = get("/v1/booking?start=$start")
                JSONAssert.assertEquals(noBooking, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `non-overlapping end date returns no bookings`() {
                val end = DateTimeFormatter.ISO_LOCAL_DATE.format(tomorrow)
                val response = get("/v1/booking?end=$end")
                JSONAssert.assertEquals(noBooking, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `get with no params returns bookings - another user masks`() {
                val response = get("/v1/booking", Global.ANOTHER_USER_REST_TEMPLATE)
                JSONAssert.assertEquals(otherUserExpectedBookings, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `get single booking`() {
                val response = response?.headers?.location?.let { get(it.toString()) }
                JSONAssert.assertEquals(expectedBooking, response?.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `get single booking - another users booking masks`() {
                val response =
                    response?.headers?.location?.let { get(it.toString(), Global.ANOTHER_USER_REST_TEMPLATE) }
                JSONAssert.assertEquals(otherUserExpectedBooking, response?.body, JSONCompareMode.LENIENT)
            }

            @AfterEach
            fun `clean up`() {
                response?.headers?.location?.let { Global.REST_TEMPLATE.delete(it) }
            }
        }

        private fun get(url: String, template: TestRestTemplate = Global.REST_TEMPLATE) =
            template.getForEntity(url, String::class.java)
    }

    @Nested
    inner class `POST a booking` {
        @Nested
        inner class `valid` {
            @Test
            fun `should return a created meeting`() {

                response = post(bookingForTomorrow, "/v1/booking")

                val jsonResponse = JSONObject(response?.body)
                expect(jsonResponse.getString("id")).not.to.be.`null`
                expect(jsonResponse.get("bookable")).not.to.be.`null`
                expect(jsonResponse.get("subject")).to.be.equal("My new meeting")
            }

            @Test
            fun `should return a created meeting in london`() {
                val bookingForTomorrowLondon =
                    """
                {
                    "bookableId": "dddc584f-6723-43ed-a8c9-3a39ab366d56",
                    "subject": "My new meeting",
                    "start": "$tomorrow",
                    "end": "$tomorrowPlusAnHour"
                }
                """

                response = post(bookingForTomorrowLondon, "/v1/booking")

                val jsonResponse = JSONObject(response?.body)
                expect(jsonResponse.getString("id")).not.to.be.`null`
                expect(jsonResponse.get("bookable")).not.to.be.`null`
                expect(jsonResponse.get("subject")).to.be.equal("My new meeting")
            }

            @AfterEach
            fun cleanup() {
                response?.headers?.location?.let { Global.REST_TEMPLATE.delete(it) }
            }
        }

        @Test
        fun `date in past should fail with 400`() {
            val requestWithPastDate =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "My meeting in the past",
                    "start": "$yesterday",
                    "end": "${yesterday.plusHours(1)}"
                }
                """

            response = post(requestWithPastDate, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.StartInPastException")
            expect(jsonResponse.get("message")).to.be.equal("Start must be in the future")
        }

        @Test
        fun `date in past of london location should fail with 400`() {
            val requestWithPastDate =
                """
                {
                    "bookableId": "dddc584f-6723-43ed-a8c9-3a39ab366d56",
                    "subject": "My meeting in the past for London",
                    "start": "${now.plusHours(1)}",
                    "end": "${now.plusHours(2)}"
                }
                """

            response = post(requestWithPastDate, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.StartInPastException")
            expect(jsonResponse.get("message")).to.be.equal("Start must be in the future")
        }

        @Test
        fun `end date before start date fails with 400`() {
            val requestWithEndBeforeStart =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "My meeting with bad date order",
                    "start": "$tomorrow",
                    "end": "${tomorrow.minusHours(1)}"
                }
                """

            response = post(requestWithEndBeforeStart, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.EndBeforeStartException")
            expect(jsonResponse.get("message")).to.be.equal("End must be after Start")
        }

        @Test
        fun `bad formatted date fails with 400`() {
            val requestWithNonDates =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "My meeting",
                    "start": "foo",
                    "end": "bar"
                }
                """

            response = post(requestWithNonDates, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.getString("exception")).to.be.equal("org.springframework.http.converter.HttpMessageNotReadableException")
            expect(jsonResponse.getString("message")).to.contain("Cannot deserialize value of type `java.time.LocalDateTime` from String \"foo\"")
        }

        @Test
        fun `no bookable id`() {
            val requestWithNonDates =
                """
                {
                    "subject": "My meeting",
                    "start": "$tomorrow",
                    "end": "$tomorrowPlusAnHour"
                }
                """

            response = post(requestWithNonDates, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.InvalidBookingRequest")
            expect(jsonResponse.get("message")).to.be.equal("Bookable/Room required. Select one and resubmit.")
        }

        @Test
        fun `no subject`() {
            val requestWithNonDates =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "start": "$tomorrow",
                    "end": "$tomorrowPlusAnHour"
                }
                """

            response = post(requestWithNonDates, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.InvalidBookingRequest")
            expect(jsonResponse.get("message")).to.be.equal("Subject is required and cannot be blank.")
        }

        @Test
        fun `blank subject`() {
            val requestWithNonDates =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "",
                    "start": "$tomorrow",
                    "end": "$tomorrowPlusAnHour"
                }
                """

            response = post(requestWithNonDates, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.InvalidBookingRequest")
            expect(jsonResponse.get("message")).to.be.equal("Subject is required and cannot be blank.")
        }

        @Test
        fun `no start`() {
            val requestWithNonDates =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "My meeting",
                    "end": "$tomorrowPlusAnHour"
                }
                """

            response = post(requestWithNonDates, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.InvalidBookingRequest")
            expect(jsonResponse.get("message")).to.be.equal("Start date & time are required.")
        }

        @Test
        fun `no end`() {
            val requestWithNonDates =
                """
                {
                    "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                    "subject": "My meeting",
                    "start": "$tomorrow"
                }
                """

            response = post(requestWithNonDates, "/v1/booking")

            val jsonResponse = JSONObject(response?.body)

            expect(response?.statusCode).to.be.equal(BAD_REQUEST)
            expect(jsonResponse.get("exception")).to.be.equal("com.buildit.bookit.v1.booking.InvalidBookingRequest")
            expect(jsonResponse.get("message")).to.be.equal("End date & time are required.")
        }

    }

    private fun post(request: String, url: String, template: TestRestTemplate = Global.REST_TEMPLATE) =
        template.postForEntity(url, request.toEntity(), String::class.java)

    @Nested
    inner class `DELETE a booking` {
        @Test
        fun `should delete a created meeting`() {
            val result = post(bookingForTomorrow, "/v1/booking")

            assertThat({ result.headers.location.let { Global.REST_TEMPLATE.delete(it) } }, !throws<Exception>())
        }

        @Test
        fun `should delete a non existent meeting`() {
            assertThat({ Global.REST_TEMPLATE.delete("/v1/booking/12345") }, !throws<Exception>())
        }

        @Nested
        inner class `DELETE another users booking` {
            @BeforeEach
            fun createBooking() {
                response = post(bookingForTomorrow, "/v1/booking", Global.ANOTHER_USER_REST_TEMPLATE)
                expect(response?.statusCode?.is2xxSuccessful).to.be.`true`
            }

            @AfterEach
            fun `clean up`() {
                response?.headers?.location?.let { Global.ANOTHER_USER_REST_TEMPLATE.delete(it) }
            }

            @Test
            fun `should not be able to delete another users bookings`() {
                val result =
                    Global.REST_TEMPLATE.exchange(response?.headers?.location, HttpMethod.DELETE, null, Any::class.java)

                expect(result.statusCode).to.be.equal(FORBIDDEN)
            }
        }
    }
}

