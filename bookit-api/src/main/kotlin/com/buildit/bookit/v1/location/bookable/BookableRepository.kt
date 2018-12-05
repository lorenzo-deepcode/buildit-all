package com.buildit.bookit.v1.location.bookable

import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.dto.Location
import org.springframework.data.repository.CrudRepository

interface BookableRepository : CrudRepository<Bookable, String> {
    fun findByLocation(location: Location): Collection<Bookable>
}
