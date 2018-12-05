package com.buildit.bookit.v1.location.bookable

import com.buildit.bookit.auth.UserPrincipal
import com.buildit.bookit.v1.booking.BookingRepository
import com.buildit.bookit.v1.booking.EndBeforeStartException
import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.booking.maxLocalDateTime
import com.buildit.bookit.v1.booking.minLocalDateTime
import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.bookable.dto.BookableResource
import com.buildit.bookit.v1.location.bookable.dto.Disposition
import com.buildit.bookit.v1.location.dto.Location
import com.buildit.bookit.v1.location.dto.LocationNotFound
import com.buildit.bookit.v1.user.dto.User
import com.natpryce.hamkrest.assertion.assertThat
import com.natpryce.hamkrest.throws
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.time.ZoneId

class BookableControllerUnitTests {
    val nyc = Location("NYC", ZoneId.of("America/New_York"), "guid1")
    val nycBookable1 = Bookable(nyc, "NYC Bookable 1", Disposition(), "guid1")
    val nycBookable2 = Bookable(nyc, "NYC Bookable 2", Disposition(), "guid2")

    val bookableRepo = mock<BookableRepository> {
        on { findByLocation(nyc) }.doReturn(listOf(nycBookable1, nycBookable2))
    }
    private val userPrincipal = UserPrincipal("foo", "bar", "baz")
    private val bookingUser = User("foo", "bar", "baz")
    private val anotherBookingUser = User("another", "user", "principal")

    private val bookingRepo = mock<BookingRepository> {}

    val bookableController = BookableController(bookableRepo, bookingRepo)

    @Nested
    inner class `v1|location|bookable` {
        @Nested
        inner class `get single bookable` {
            @Nested
            inner class `that is known` {
                @Test
                fun `should return bookable1`() {
                    val bookable = bookableController.getBookable(nyc, nycBookable1)

                    expect(bookable).to.be.equal(BookableResource(nycBookable1))
                }
            }

            @Nested
            inner class `that is unknown` {
                @Test
                fun `throws exception for invalid bookable`() {
                    assertThat({ bookableController.getBookable(nyc, null) }, throws<BookableNotFound>())
                }

                @Test
                fun `throws exception for invalid location`() {
                    assertThat({ bookableController.getBookable(null, nycBookable1) }, throws<LocationNotFound>())
                }
            }
        }

        @Nested
        inner class `get multiple bookables` {
            @Nested
            inner class `for location` {
                @Test
                fun `returns all bookables`() {
                    val allBookables = bookableController.getAllBookables(nyc, userPrincipal)
                    expect(allBookables).to.contain(BookableResource(nycBookable1))
                    expect(allBookables).to.contain(BookableResource(nycBookable2))
                }

                @Test
                fun `with invalid location throws exception`() {
                    assertThat({ bookableController.getAllBookables(null, userPrincipal) }, throws<LocationNotFound>())
                }
            }

            @Nested
            inner class `expand bookings` {
                private val today: LocalDate = LocalDate.now(ZoneId.of("America/New_York"))
                private val expandBookings = listOf("bookings")

                @Test
                fun `requires startDate before endDate`() {
                    assertThat(
                        {
                            bookableController.getAllBookables(
                                nyc,
                                userPrincipal,
                                today,
                                today.minusDays(1),
                                expandBookings
                            )
                        },
                        throws<EndBeforeStartException>()
                    )
                }

                @Test
                fun `finds an available bookable - no bookings`() {
                    expect(
                        bookableController.getAllBookables(nyc, userPrincipal, today, today, expandBookings)
                    )
                        .to.contain(BookableResource(nycBookable1, emptyList()))
                }

                @Nested
                inner class `with bookings` {

                    private val bookingToday =
                        Booking(
                            nycBookable1,
                            "Booking 1",
                            today.atTime(9, 15),
                            today.atTime(10, 15),
                            bookingUser,
                            "guid1"
                        )
                    private val anotherUsersBookingToday =
                        Booking(
                            nycBookable1,
                            "Booking Another",
                            today.atTime(12, 0),
                            today.atTime(12, 30),
                            anotherBookingUser,
                            "guidAnother"
                        )
                    private val anotherUsersBookingTodayMasked = anotherUsersBookingToday.copy(subject = "**********")
                    private val bookingToday2 =
                        Booking(
                            nycBookable1,
                            "Booking 2",
                            today.atTime(11, 0),
                            today.atTime(11, 30),
                            bookingUser,
                            "guid2"
                        )
                    private val bookingTodayDifferentBookable =
                        Booking(
                            nycBookable2,
                            "Booking 3, different bookable",
                            today.atTime(11, 0),
                            today.atTime(11, 30),
                            bookingUser,
                            "guid3"
                        )
                    private val bookingYesterday =
                        Booking(
                            nycBookable1,
                            "Booking 4, yesterday",
                            today.minusDays(1).atTime(11, 0),
                            today.minusDays(1).atTime(11, 30),
                            bookingUser,
                            "guid4"
                        )
                    private val bookingTomorrow =
                        Booking(
                            nycBookable1,
                            "Booking 5, tomorrow",
                            today.plusDays(1).atTime(11, 0),
                            today.plusDays(1).atTime(11, 30),
                            bookingUser,
                            "guid5"
                        )

                    @Test
                    fun `finds bookable - with bookings from all users`() {
                        val bookingRepo = mock<BookingRepository> {
                            on {
                                findByBookableAndOverlap(
                                    nycBookable1,
                                    today.atStartOfDay(),
                                    today.plusDays(1).atStartOfDay()
                                )
                            }.doReturn(listOf(bookingToday, bookingToday2, anotherUsersBookingToday))
                            on {
                                findByBookableAndOverlap(
                                    nycBookable2,
                                    today.atStartOfDay(),
                                    today.plusDays(1).atStartOfDay()
                                )
                            }.doReturn(listOf(bookingTodayDifferentBookable))
                        }

                        val controller = BookableController(bookableRepo, bookingRepo)

                        val bookables =
                            controller.getAllBookables(nyc, userPrincipal, today, today.plusDays(1), expandBookings)
                        expect(bookables).to.contain(
                            BookableResource(
                                nycBookable1,
                                listOf(bookingToday, bookingToday2, anotherUsersBookingTodayMasked)
                            )
                        )
                        expect(bookables).to.contain(
                            BookableResource(
                                nycBookable2,
                                listOf(bookingTodayDifferentBookable)
                            )
                        )
                    }

                    @Test
                    fun `endDate defaults to end of time`() {
                        val bookingRepo = mock<BookingRepository> {
                            on {
                                findByBookableAndOverlap(
                                    nycBookable1,
                                    today.atStartOfDay(),
                                    maxLocalDateTime
                                )
                            }.doReturn(listOf(bookingToday, bookingToday2, anotherUsersBookingToday, bookingTomorrow))
                            on {
                                findByBookableAndOverlap(
                                    nycBookable2,
                                    today.atStartOfDay(),
                                    maxLocalDateTime
                                )
                            }.doReturn(listOf(bookingTodayDifferentBookable))
                        }

                        val controller = BookableController(bookableRepo, bookingRepo)

                        expect(
                            controller.getAllBookables(nyc, userPrincipal, today, expand = expandBookings)
                        )
                            .to.contain(
                            BookableResource(
                                nycBookable1,
                                listOf(bookingToday, bookingToday2, anotherUsersBookingTodayMasked, bookingTomorrow)
                            )
                        )
                    }

                    @Test
                    fun `startDate defaults to beginning of time`() {
                        val bookingRepo = mock<BookingRepository> {
                            on {
                                findByBookableAndOverlap(
                                    nycBookable1,
                                    minLocalDateTime,
                                    today.atStartOfDay()
                                )
                            }.doReturn(listOf(bookingYesterday))
                        }

                        val controller = BookableController(bookableRepo, bookingRepo)

                        expect(
                            controller.getAllBookables(
                                nyc,
                                userPrincipal,
                                endDateExclusive = today,
                                expand = expandBookings
                            )
                        )
                            .to.contain(BookableResource(nycBookable1, listOf(bookingYesterday)))
                    }

                    @Test
                    fun `finds bookable - no bookings on date`() {
                        val bookingRepo = mock<BookingRepository> { }

                        val controller = BookableController(bookableRepo, bookingRepo)

                        expect(
                            controller.getAllBookables(
                                nyc,
                                userPrincipal,
                                today.plusDays(2),
                                today.plusDays(3),
                                expandBookings
                            )
                        )
                            .to.contain(BookableResource(nycBookable1, emptyList()))
                    }
                }
            }
        }
    }
}
