package com.buildit.bookit.v1.location.bookable.dto

import com.buildit.bookit.v1.booking.dto.Booking
import com.buildit.bookit.v1.location.dto.Location
import com.fasterxml.jackson.annotation.JsonUnwrapped
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NaturalId
import javax.persistence.Column
import javax.persistence.Embeddable
import javax.persistence.Embedded
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class Bookable(
    @ManyToOne(optional = false) @NaturalId
    val location: Location,
    @Column(nullable = false) @NaturalId
    val name: String,
    @Embedded
    val disposition: Disposition = Disposition(),
    @Id @GeneratedValue(generator = "uuid2") @GenericGenerator(name = "uuid2", strategy = "uuid2") @Column(length = 36)
    val id: String? = null
)

@Embeddable
data class Disposition(
    @Column(nullable = false)
    val closed: Boolean = false,
    @Column(nullable = false)
    val reason: String = ""
)

data class BookableResource(
    @JsonUnwrapped
    val bookable: Bookable,
    val bookings: Collection<Booking> = emptyList()
)
