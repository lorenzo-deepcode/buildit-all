package com.buildit.bookit.v1.booking

import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.location.bookable.dto.Bookable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface BookingRepository : CrudRepository<Booking, String> {
    @EntityGraph(attributePaths = ["bookable", "user", "bookable.location"])
    @Query("select b from Booking b where b.start < :end AND b.end > :start")
    fun findByOverlap(@Param("start") start: LocalDateTime, @Param("end") end: LocalDateTime): List<Booking>

    @EntityGraph(attributePaths = ["user"])
    @Query("select b from Booking b where b.bookable = :bookable AND b.start < :end AND b.end > :start")
    fun findByBookableAndOverlap(@Param("bookable") bookable: Bookable, @Param("start") start: LocalDateTime, @Param("end") end: LocalDateTime): List<Booking>
}
