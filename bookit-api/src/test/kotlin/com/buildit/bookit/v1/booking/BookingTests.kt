package com.buildit.bookit.v1.booking

import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.bookable.dto.Disposition
import com.buildit.bookit.v1.location.dto.Location
import com.buildit.bookit.v1.user.dto.User
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.time.ZoneId

class BookingTests {
    @Test
    fun `returns timezone offset abbreviation`() {
        val booking = Booking(
            Bookable(Location("NYC", ZoneId.of("America/New_York")), "bookable", Disposition()), "Subject",
            LocalDateTime.of(2018, 1, 1, 12, 0),
            LocalDateTime.of(2018, 6, 1, 12, 0),
            User("foo", "bar", "baz")
        )
        expect(booking.startTimezoneAbbreviation).to.equal("EST")
        expect(booking.endTimezoneAbbreviation).to.equal("EDT")
    }
}
