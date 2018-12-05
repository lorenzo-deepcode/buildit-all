package com.buildit.bookit.v1.user.dto

import com.buildit.bookit.auth.UserPrincipal
import com.buildit.bookit.v1.booking.dto.Booking
import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.annotations.GenericGenerator
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity
data class User(
    @Column(unique = true, nullable = false)
    val externalId: String,
    @Column(nullable = false) @JsonIgnore
    val givenName: String,
    @Column(nullable = false) @JsonIgnore
    val familyName: String,
    @Id @GeneratedValue(generator = "uuid2") @GenericGenerator(name = "uuid2", strategy = "uuid2") @Column(length = 36)
    val id: String? = null
) {
    val name get() = "$givenName $familyName".trim()
}

const val MASKED_STRING = "**********"
fun maskSubjectIfOtherUser(booking: Booking, otherUser: UserPrincipal?): Booking =
    when {
        booking.user.externalId != otherUser?.subject -> booking.copy(subject = MASKED_STRING)
        else -> booking
    }
