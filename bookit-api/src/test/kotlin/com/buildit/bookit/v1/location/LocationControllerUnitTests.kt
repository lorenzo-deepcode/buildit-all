package com.buildit.bookit.v1.location

import com.buildit.bookit.v1.location.dto.Location
import com.buildit.bookit.v1.location.dto.LocationNotFound
import com.natpryce.hamkrest.assertion.assertThat
import com.natpryce.hamkrest.throws
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import java.time.ZoneId

class LocationControllerUnitTests {
    val nyc = Location("NYC", ZoneId.of("America/New_York"), "guid1")
    val mockRepository = mock<LocationRepository> {
        val denver = Location("DEN", ZoneId.of("America/Denver"), "guid2")
        on { findAll() }.doReturn(
            listOf(
                nyc,
                denver
            )
        )
        on { findOne(nyc.id) }.doReturn(nyc)
    }

    @Nested
    inner class `v1|location` {
        @Nested
        inner class `getLocations()` {
            @Test
            fun `should return all locations`() {
                val locationController = LocationController(mockRepository)
                expect(locationController.getLocations().size).to.be.equal(2)
            }
        }

        @Nested
        inner class `getLocation()` {
            @Nested
            inner class `with known location` {
                @Test
                fun `should return the location`() {
                    val locationController = LocationController(mockRepository)
                    expect(locationController.getLocation(nyc).name).to.be.equal("NYC")
                }
            }

            @Nested
            inner class `with unknown location` {
                @Test
                fun `should throw an exception`() {
                    val locationController = LocationController(mockRepository)
                    assertThat({ locationController.getLocation(null) }, throws<LocationNotFound>())
                }
            }
        }
    }
}
