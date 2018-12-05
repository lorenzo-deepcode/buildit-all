package com.buildit.bookit.v1.location

import com.buildit.bookit.v1.location.dto.Location
import com.buildit.bookit.v1.location.dto.LocationNotFound
import io.swagger.annotations.ApiParam
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

// /v1/location/id/bookable/id/booking

/**
 * Location endpoint.  Locations contain bookables
 */
@RestController
@RequestMapping("/v1/location")
@Transactional
class LocationController(private val locationRepository: LocationRepository) {
    @Transactional(readOnly = true)
    @GetMapping
    fun getLocations(): Collection<Location> = locationRepository.findAll().toList()

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    fun getLocation(@PathVariable("id") @ApiParam(type = "java.lang.String") location: Location?): Location =
        location ?: throw LocationNotFound()
}
