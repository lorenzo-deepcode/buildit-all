package com.buildit.bookit.v1.location.bookable

import com.buildit.bookit.Global
import com.buildit.bookit.toEntity
import com.winterbe.expekt.expect
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.skyscreamer.jsonassert.JSONAssert
import org.skyscreamer.jsonassert.JSONCompareMode
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit

/**
 * Test /v1/location/<location>/bookable like a black box
 */
class `Bookable E2E Tests` {
    private val now = LocalDateTime.now(ZoneId.of("America/New_York"))
    private val today = LocalDate.now(ZoneId.of("America/New_York"))
    private val inOneMinute = now.plusMinutes(1)
    private val inTwoMinutes = now.plusMinutes(2)

    @Test
    fun `get 1 bookable`() {
        // act
        val response = Global.REST_TEMPLATE.getForEntity(
            "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable/aab6d676-d3cb-4b9b-b285-6e63058aeda8",
            String::class.java
        )

        // assert
        val expectedResponse = """
                        {
                            "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                            "location": {
                                "id": "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
                            },
                            "name": "Red Room",
                            "disposition": {
                                "closed": false,
                                "reason": ""
                            },
                            bookings: []
                        }
                    """.trimIndent()
        JSONAssert.assertEquals(expectedResponse, response.body, JSONCompareMode.LENIENT)
    }

    private val allBookables = """
                            [
                                {
                                    "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                                    "location": {
                                        "id": "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
                                    },
                                    "name": "Red Room",
                                    "disposition": {
                                        "closed": false,
                                        "reason": ""
                                    },
                                    bookings: []
                                },
                                {
                                    "id": "1c824c61-7539-41d7-b723-d4447826ba50"
                                },
                                {
                                    "id": "23787564-e99d-4741-b285-4d17cc29bf8d"
                                },
                                {
                                    "id": "a7b68976-8dda-44f2-8e39-4e2b6c3514cd"
                                },
                                {
                                    "id": "25708e84-cf1b-45aa-b062-0af903328a52"
                                },
                                {
                                    "id": "cc4bd7e5-00f6-4903-86a2-abf5423edb84"
                                },
                                {
                                    "id": "86d0eb7c-cce0-400a-b413-72f19ba11230",
                                    "location": {
                                        "id": "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
                                    },
                                    "name": "Randolph Room",
                                    "disposition": {
                                        "closed": true,
                                        "reason": "Out of beer!"
                                    },
                                    bookings: []
                                }
                            ]
                        """.trimIndent()

    @Test
    fun `get all bookables`() {
        // act
        val response = Global.REST_TEMPLATE.getForEntity(
            "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable",
            String::class.java
        )

        // assert
        JSONAssert.assertEquals(allBookables, response.body, JSONCompareMode.LENIENT)
    }

    @Nested
    inner class `Search for bookables` {
        @Test
        fun `should require start before end`() {
            val response = Global.REST_TEMPLATE.getForEntity(
                "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable?start=$today&end=${today.minusDays(1)}",
                String::class.java
            )

            expect(response.statusCode).to.equal(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `should find available bookable`() {
            // act
            val response = Global.REST_TEMPLATE.getForEntity(
                "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable?start=$today&end=$today&expand=bookings",
                String::class.java
            )

            // assert
            JSONAssert.assertEquals(allBookables, response.body, JSONCompareMode.LENIENT)
        }

        @Nested
        inner class `room unavailable` {
            private var createResponse: ResponseEntity<String>? = null

            @BeforeEach
            fun `create booking`() {
                val goodRequest =
                    """
                            {
                                "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                                "subject": "My new meeting",
                                "start": "$inOneMinute",
                                "end": "$inTwoMinutes"
                            }
                            """
                createResponse =
                        Global.REST_TEMPLATE.postForEntity("/v1/booking", goodRequest.toEntity(), String::class.java)
            }

            @Test
            fun `should find bookable with bookings`() {
                // act
                val response = Global.REST_TEMPLATE.getForEntity(
                    "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable?expand=bookings",
                    String::class.java
                )

                // assert
                val expectedResponse = """
                        [
                            {
                                "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                                "location": {
                                    "id": "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
                                },
                                "name": "Red Room",
                                "disposition": {
                                    "closed": false,
                                    "reason": ""
                                },
                                bookings: [
                                    {
                                        "bookable": {
                                            "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8"
                                        },
                                        "subject": "My new meeting",
                                        "start": "${inOneMinute.truncatedTo(ChronoUnit.MINUTES)}",
                                        "end": "${inTwoMinutes.truncatedTo(ChronoUnit.MINUTES)}",
                                        "user": {
                                            "name": "Fake Auth User",
                                            "externalId": "${Global.FAKE_OID}"
                                        }
                                    }
                                ]
                            },
                            {
                                "id": "1c824c61-7539-41d7-b723-d4447826ba50"
                            },
                            {
                                "id": "23787564-e99d-4741-b285-4d17cc29bf8d"
                            },
                            {
                                "id": "a7b68976-8dda-44f2-8e39-4e2b6c3514cd"
                            },
                            {
                                "id": "25708e84-cf1b-45aa-b062-0af903328a52"
                            },
                            {
                                "id": "cc4bd7e5-00f6-4903-86a2-abf5423edb84"
                            },
                            {
                                "id": "86d0eb7c-cce0-400a-b413-72f19ba11230"
                            }
                        ]
                    """.trimIndent()
                JSONAssert.assertEquals(expectedResponse, response.body, JSONCompareMode.LENIENT)
            }

            @Test
            fun `should find bookable with no bookings on different day`() {
                // act
                val response = Global.REST_TEMPLATE.getForEntity(
                    "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable?start=${today.plusDays(1)}&expand=bookings",
                    String::class.java
                )

                // assert
                JSONAssert.assertEquals(allBookables, response.body, JSONCompareMode.LENIENT)
            }

            @AfterEach
            fun `delete booking`() {
                createResponse?.headers?.location?.let { Global.REST_TEMPLATE.delete(it) }
            }
        }

        @Nested
        inner class `another users booking` {
            private var createResponse: ResponseEntity<String>? = null

            @BeforeEach
            fun `create booking`() {
                val goodRequest =
                    """
                            {
                                "bookableId": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                                "subject": "My new meeting",
                                "start": "$inOneMinute",
                                "end": "$inTwoMinutes"
                            }
                            """
                createResponse = Global.ANOTHER_USER_REST_TEMPLATE.postForEntity(
                    "/v1/booking",
                    goodRequest.toEntity(),
                    String::class.java
                )
            }

            @Test
            fun `should hide booking details`() {
                // act
                val response = Global.REST_TEMPLATE.getForEntity(
                    "/v1/location/b1177996-75e2-41da-a3e9-fcdd75d1ab31/bookable?expand=bookings",
                    String::class.java
                )

                // assert
                val expectedResponse = """
                        [
                            {
                                "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8",
                                "location": {
                                    id: "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
                                },
                                "name": "Red Room",
                                "disposition": {
                                    "closed": false,
                                    "reason": ""
                                },
                                bookings: [
                                    {
                                        "bookable": {
                                            "id": "aab6d676-d3cb-4b9b-b285-6e63058aeda8"
                                        },
                                        "subject": "**********",
                                        "user": {
                                            "name": "Another Fake User",
                                            "externalId": "${Global.ANOTHER_FAKE_OID}"
                                        }
                                    }
                                ]
                            },
                            {
                                "id": "1c824c61-7539-41d7-b723-d4447826ba50"
                            },
                            {
                                "id": "23787564-e99d-4741-b285-4d17cc29bf8d"
                            },
                            {
                                "id": "a7b68976-8dda-44f2-8e39-4e2b6c3514cd"
                            },
                            {
                                "id": "25708e84-cf1b-45aa-b062-0af903328a52"
                            },
                            {
                                "id": "cc4bd7e5-00f6-4903-86a2-abf5423edb84"
                            },
                            {
                                "id": "86d0eb7c-cce0-400a-b413-72f19ba11230"
                            }
                        ]
                    """.trimIndent()
                JSONAssert.assertEquals(expectedResponse, response.body, JSONCompareMode.LENIENT)
            }

            @AfterEach
            fun `delete booking`() {
                createResponse?.headers?.location?.let { Global.ANOTHER_USER_REST_TEMPLATE.delete(it) }
            }
        }

    }
}
