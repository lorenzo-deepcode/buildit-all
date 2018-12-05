package com.buildit.bookit.v1.booking

import com.buildit.bookit.auth.UserPrincipal
import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.booking.dto.BookingRequest
import com.buildit.bookit.v1.location.bookable.BookableRepository
import com.buildit.bookit.v1.location.bookable.InvalidBookable
import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.bookable.dto.Disposition
import com.buildit.bookit.v1.location.dto.Location
import com.buildit.bookit.v1.user.UserService
import com.buildit.bookit.v1.user.dto.MASKED_STRING
import com.buildit.bookit.v1.user.dto.User
import com.natpryce.hamkrest.assertion.assertThat
import com.natpryce.hamkrest.throws
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.verify
import com.winterbe.expekt.expect
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.Clock
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit

class BookingControllerUnitTests {
    private lateinit var bookingController: BookingController
    private lateinit var bookableRepo: BookableRepository
    private val clock: Clock = Clock.systemUTC()
    private val nycTz = ZoneId.of("America/New_York")
    private val nyc = Location("NYC", nycTz, "guid-nyc")
    private val today: LocalDate = LocalDate.now(nycTz)
    private val nycBookable1 = Bookable(nyc, "NYC Bookable 1", Disposition(), "guid")
    private val nycBookable2 = Bookable(nyc, "NYC Bookable 2", Disposition(), "guid")
    private val userPrincipal = UserPrincipal("foo", "bar", "baz")
    private val anotherUserPrincipal = UserPrincipal("yet", "another", "user")
    private val bookingUser = User("foo", "bar", "baz", "user-guid")
    private val bookingToday =
        Booking(nycBookable1, "Booking today", today.atTime(9, 15), today.atTime(10, 15), bookingUser, "guid1")

    @BeforeEach
    fun setup() {
        bookableRepo = mock {
            on { findAll() }.doReturn(listOf(nycBookable1, nycBookable2))
            on { findOne(nycBookable1.id) }.doReturn(nycBookable1)
        }
    }

    @Nested
    inner class `|v1|booking` {
        @Nested
        inner class `GET` {
            private lateinit var bookingRepo: BookingRepository

            private val bookingToday =
                Booking(
                    nycBookable1,
                    "Booking today",
                    today.atTime(9, 15),
                    today.atTime(10, 15),
                    bookingUser,
                    "guid1"
                )
            private val bookingTomorrow =
                Booking(
                    nycBookable1,
                    "Booking tomorrow",
                    today.plusDays(1).atTime(9, 15),
                    today.plusDays(1).atTime(10, 15),
                    bookingUser,
                    "guid2"
                )
            private val bookingTodayDifferentBookable =
                Booking(
                    nycBookable2,
                    "Booking today, different bookable",
                    today.atTime(11, 0),
                    today.atTime(11, 30),
                    bookingUser,
                    "guid3"
                )
            private val bookingYesterday =
                Booking(
                    nycBookable1,
                    "Booking yesterday",
                    today.minusDays(1).atTime(9, 15),
                    today.minusDays(1).atTime(10, 15),
                    bookingUser,
                    "guid4"
                )

            @BeforeEach
            fun setup() {
                bookingRepo = mock {
                    on { findAll() }.doReturn(
                        listOf(bookingToday, bookingTomorrow, bookingTodayDifferentBookable, bookingYesterday)
                    )
                    on { findByOverlap(today.atStartOfDay(), today.plusDays(1).atStartOfDay()) }.doReturn(
                        listOf(bookingToday, bookingTodayDifferentBookable)
                    )
                    on { findByOverlap(minLocalDateTime, today.plusDays(1).atStartOfDay()) }.doReturn(
                        listOf(bookingToday, bookingTodayDifferentBookable, bookingYesterday)
                    )
                    on { findByOverlap(today.atStartOfDay(), maxLocalDateTime) }.doReturn(
                        listOf(bookingToday, bookingTodayDifferentBookable, bookingTomorrow)
                    )
                }
                bookingController = BookingController(bookingRepo, bookableRepo, mock {}, mock {}, mock {})
            }

            @Nested
            inner class `invoking getAllBookings()` {
                @Test
                fun `returns all existing bookings`() {
                    val bookings = bookingController.getAllBookings(userPrincipal)
                    expect(bookings.size).to.be.equal(4)
                    expect(bookings).to.satisfy { it.none { booking -> booking.subject == MASKED_STRING } }
                }

                @Test
                fun `returns all existing bookings - different user masks`() {
                    val bookings = bookingController.getAllBookings(anotherUserPrincipal)
                    expect(bookings.size).to.be.equal(4)
                    expect(bookings).to.satisfy { it.all { booking -> booking.subject == MASKED_STRING } }
                }

                @Test
                fun `returns all existing bookings filtered by start (inclusive) and end (exclusive)`() {
                    val bookings = bookingController.getAllBookings(userPrincipal, today, today.plusDays(1))
                    expect(bookings).to.have.size(2)
                    expect(bookings).to.have.all.elements(bookingToday, bookingTodayDifferentBookable)
                }

                @Test
                fun `fails when end before start`() {
                    assertThat(
                        {
                            bookingController.getAllBookings(userPrincipal, today, today.minusDays(1))
                        },
                        throws<EndBeforeStartException>()
                    )
                }

                @Test
                fun `fails when start == end`() {
                    assertThat(
                        {
                            bookingController.getAllBookings(userPrincipal, today, today)
                        },
                        throws<EndBeforeStartException>()
                    )
                }

                @Test
                fun `start defaults to start of time`() {
                    val bookings = bookingController.getAllBookings(userPrincipal, endDateExclusive = today.plusDays(1))
                    expect(bookings).to.have.size(3)
                    expect(bookings).to.have.all.elements(bookingToday, bookingTodayDifferentBookable, bookingYesterday)
                }

                @Test
                fun `end defaults to end of time`() {
                    val bookings = bookingController.getAllBookings(userPrincipal, today)
                    expect(bookings).to.have.size(3)
                    expect(bookings).to.have.all.elements(bookingToday, bookingTodayDifferentBookable, bookingTomorrow)
                }

                @Test
                fun `no bookings on date`() {
                    val bookings = bookingController.getAllBookings(userPrincipal, today.plusYears(1))
                    expect(bookings).to.have.size(0)
                }
            }

            @Nested
            inner class `invoking getBooking()` {

                @Test
                fun `getBooking() for existing booking returns that booking`() {
                    val booking = BookingController(bookingRepo, mock {}, mock {}, mock {}, clock).getBooking(
                        bookingToday,
                        userPrincipal
                    )
                    expect(booking.id).to.be.equal("guid1")
                    expect(booking.subject).to.be.equal(bookingToday.subject)
                }

                @Test
                fun `getBooking() for existing booking returns that booking - different user masks`() {
                    val booking = BookingController(bookingRepo, mock {}, mock {}, mock {}, clock).getBooking(
                        bookingToday,
                        anotherUserPrincipal
                    )
                    expect(booking.id).to.be.equal("guid1")
                    expect(booking.subject).to.be.equal(MASKED_STRING)
                }

                @Test
                fun `getBooking() for nonexistent booking throws exception`() {
                    fun action() =
                        BookingController(bookingRepo, mock {}, mock {}, mock {}, clock).getBooking(null, userPrincipal)
                    assertThat({ action() }, throws<BookingNotFound>())
                }
            }
        }

        @Nested
        inner class `POST` {
            private val start = LocalDateTime.now(nycTz).plusHours(1).truncatedTo(ChronoUnit.MINUTES)
            private val end = start.plusHours(1)

            private val expectedBooking = Booking(nycBookable1, "MyRequest", start, end, bookingUser)

            private lateinit var userService: UserService

            @BeforeEach
            fun setup() {
                val bookingRepository = mock<BookingRepository> {
                    on { save(expectedBooking) }.doReturn(expectedBooking)
                    on {
                        findByBookableAndOverlap(
                            nycBookable1,
                            start.minusMinutes(30),
                            end.minusMinutes(30)
                        )
                    }.doReturn(
                        listOf(
                            Booking(
                                nycBookable1,
                                "Before",
                                start.minusHours(1),
                                end.minusHours(1),
                                bookingUser,
                                "guid1"
                            )
                        )
                    )
                    on { findByBookableAndOverlap(nycBookable1, start.plusMinutes(30), end.plusMinutes(30)) }.doReturn(
                        listOf(
                            Booking(nycBookable1, "After", start.plusHours(1), end.plusHours(1), bookingUser, "guid2")
                        )
                    )
                }

                userService = mock {
                    on { register(any()) }.doReturn(bookingUser)
                }

                bookingController = BookingController(bookingRepository, bookableRepo, userService, mock {}, clock)
            }

            @Test
            fun `should create a booking`() {
                val request = BookingRequest(nycBookable1.id, "MyRequest", start, end)

                val response = bookingController.createBooking(request, userPrincipal = userPrincipal)
                val booking = response.body

                expect(booking).to.equal(expectedBooking)
            }

            @Test
            fun `should chop seconds`() {
                val request = BookingRequest(nycBookable1.id, "MyRequest", start.plusSeconds(59), end.plusSeconds(59))

                val response = bookingController.createBooking(request, userPrincipal = userPrincipal)
                val booking = response.body

                expect(booking).to.equal(expectedBooking)
            }

            @Test
            fun `should validate bookable exists`() {
                val request = BookingRequest("guid-not-there", "MyRequest", start, end)
                fun action() = bookingController.createBooking(request, userPrincipal = userPrincipal)
                assertThat({ action() }, throws<InvalidBookable>())
            }

            @Test
            fun `should check that the bookable is available - overlap beginning`() {
                val request = BookingRequest(
                    nycBookable1.id,
                    "MyRequest",
                    start.minusMinutes(30),
                    end.minusMinutes(30)
                )

                fun action() = bookingController.createBooking(request, userPrincipal = userPrincipal)
                assertThat({ action() }, throws<BookableNotAvailable>())
            }

            @Test
            fun `should check that the bookable is available - overlap end`() {
                val request = BookingRequest(
                    nycBookable1.id,
                    "MyRequest",
                    start.plusMinutes(30),
                    end.plusMinutes(30)
                )

                fun action() = bookingController.createBooking(request, userPrincipal = userPrincipal)
                assertThat({ action() }, throws<BookableNotAvailable>())
            }
        }

        @Nested
        inner class `DELETE` {
            private lateinit var bookingRepo: BookingRepository
            private lateinit var userService: UserService

            @BeforeEach
            fun setup() {
                userService = mock {
                    on { register(userPrincipal) }.doReturn(bookingUser)
                }
                bookingRepo = mock {}
                bookingController = BookingController(bookingRepo, bookableRepo, userService, mock {}, clock)
            }

            @Test
            fun `should delete a booking`() {
                val result = bookingController.deleteBooking(bookingToday, userPrincipal)

                expect(result.statusCode).to.equal(HttpStatus.NO_CONTENT)
                verify(bookingRepo).delete(bookingToday)
            }

            @Test
            fun `should delete non existent booking`() {
                val result = bookingController.deleteBooking(null, userPrincipal)

                expect(result.statusCode).to.equal(HttpStatus.NO_CONTENT)
            }

            @Test
            fun `should not delete other booking`() {
                val result = bookingController.deleteBooking(bookingToday, anotherUserPrincipal)

                expect(result.statusCode).to.equal(HttpStatus.FORBIDDEN)
            }
        }
    }
}
