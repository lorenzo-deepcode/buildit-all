package com.buildit.bookit.v1.location.dto

import org.hibernate.annotations.GenericGenerator
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import java.time.ZoneId
import java.time.format.TextStyle
import java.util.Locale
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

/**
 * Location response
 */
@Entity
data class Location(
    @Column(unique = true, nullable = false)
    val name: String,
    @Column(nullable = false)
    val timeZone: ZoneId,
    @Id @GeneratedValue(generator = "uuid2") @GenericGenerator(name = "uuid2", strategy = "uuid2") @Column(length = 36)
    val id: String? = null
) {
    val timezoneDisplayName get() = this.timeZone.getDisplayName(TextStyle.FULL, Locale.ENGLISH)
}

/**
 * 404 location not found
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
class LocationNotFound : RuntimeException("Location not found")
