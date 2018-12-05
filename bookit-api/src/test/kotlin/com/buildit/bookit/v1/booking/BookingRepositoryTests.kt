package com.buildit.bookit.v1.booking

import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.location.bookable.BookableRepository
import com.buildit.bookit.v1.user.UserRepository
import com.buildit.bookit.v1.user.dto.User
import com.winterbe.expekt.expect
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.LocalDateTime

/**
 * Booking controller unit tests
 */
@ExtendWith(SpringExtension::class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BookingRepositoryTests @Autowired constructor(
    private val bookingRepo: BookingRepository,
    bookableRepo: BookableRepository,
    private val userRepo: UserRepository
) {
    private val start = LocalDateTime.parse("2017-04-21T10:00")
    private val end = LocalDateTime.parse("2017-04-21T11:00")
    private val bookable = bookableRepo.findAll().first()
    private val anotherBookable = bookableRepo.findAll().last()
    private lateinit var booking: Booking
    private lateinit var anotherBooking: Booking
    lateinit var creatingUser: User

    @BeforeEach
    fun setup() {
        creatingUser = userRepo.save(User("external-userid-guid", "Test", "User"))

        booking = bookingRepo.save(
            Booking(bookable, "Subject", start, end, creatingUser)
        )
        anotherBooking = bookingRepo.save(
            Booking(anotherBookable, "Another", start, end, creatingUser)
        )
    }

    @Test
    fun getAllBookingsNoBookings() {
        bookingRepo.delete(listOf(booking, anotherBooking))
        val bookings = bookingRepo.findAll()?.toList()

        expect(bookings).has.size(0)
    }

    @Test
    fun insertBooking() {
        val booking = bookingRepo.save(
            Booking(
                bookable,
                "My Inserted",
                start,
                end,
                creatingUser
            )
        )

        expect(booking.id).not.to.be.`null`
        expect(booking.bookable).to.be.equal(bookable)
        expect(booking.subject).to.be.equal("My Inserted")
        expect(booking.start).to.be.equal(start)
        expect(booking.end).to.be.equal(end)
    }

    @Test
    fun `delete existing booking`() {
        val booking = bookingRepo.save(
            Booking(
                bookable,
                "My Inserted",
                start,
                end,
                creatingUser
            )
        )
        expect(bookingRepo.findOne(booking.id)).to.not.be.`null`
        bookingRepo.delete(booking)
        expect(bookingRepo.findOne(booking.id)).to.be.`null`
    }

    @Test
    fun getAllBookings1Booking() {
        val bookings = bookingRepo.findAll()?.toList()

        expect(bookings).to.contain(booking)
        expect(bookings).to.contain(anotherBooking)
    }

    @Test
    fun findByOverlapAll() {
        val bookings =
            bookingRepo.findByOverlap(LocalDateTime.of(1900, 1, 1, 12, 0), LocalDateTime.of(3000, 1, 1, 12, 0))

        expect(bookings).to.contain(booking)
        expect(bookings).to.contain(anotherBooking)
    }

    @Test
    fun findByOverlapStart() {
        val bookings = bookingRepo.findByOverlap(start.minusMinutes(30), end.minusMinutes(30))

        expect(bookings).to.contain(booking)
        expect(bookings).to.contain(anotherBooking)
    }

    @Test
    fun findByOverlapEnd() {
        val bookings = bookingRepo.findByOverlap(start.plusMinutes(30), end.plusMinutes(30))

        expect(bookings).to.contain(booking)
        expect(bookings).to.contain(anotherBooking)
    }

    @Test
    fun findByOverlapTooSoon() {
        val bookings = bookingRepo.findByOverlap(start.minusHours(2), end.minusHours(2))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByOverlapTooLate() {
        val bookings = bookingRepo.findByOverlap(start.plusHours(2), end.plusHours(2))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByOverlapStartExclusive() {
        val bookings = bookingRepo.findByOverlap(start.minusHours(1), end.minusHours(1))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByOverlapEndExclusive() {
        val bookings = bookingRepo.findByOverlap(start.plusHours(1), end.plusHours(1))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapAll() {
        val bookings = bookingRepo.findByBookableAndOverlap(
            bookable,
            LocalDateTime.of(1900, 1, 1, 12, 0),
            LocalDateTime.of(3000, 1, 1, 12, 0)
        )

        expect(bookings).to.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapStart() {
        val bookings = bookingRepo.findByBookableAndOverlap(bookable, start.minusMinutes(30), end.minusMinutes(30))

        expect(bookings).to.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapEnd() {
        val bookings = bookingRepo.findByBookableAndOverlap(bookable, start.plusMinutes(30), end.plusMinutes(30))

        expect(bookings).to.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapTooSoon() {
        val bookings = bookingRepo.findByBookableAndOverlap(bookable, start.minusHours(2), end.minusHours(2))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapTooLate() {
        val bookings = bookingRepo.findByBookableAndOverlap(bookable, start.plusHours(2), end.plusHours(2))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapStartExclusive() {
        val bookings = bookingRepo.findByBookableAndOverlap(bookable, start.minusHours(1), end.minusHours(1))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }

    @Test
    fun findByBookableAndOverlapEndExclusive() {
        val bookings = bookingRepo.findByBookableAndOverlap(bookable, start.plusHours(1), end.plusHours(1))

        expect(bookings).to.not.contain(booking)
        expect(bookings).to.not.contain(anotherBooking)
    }
}
