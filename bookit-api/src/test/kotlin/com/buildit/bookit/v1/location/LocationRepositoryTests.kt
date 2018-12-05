package com.buildit.bookit.v1.location

import com.buildit.bookit.v1.location.dto.Location
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZoneId

/**
 * Booking controller unit tests
 */
@ExtendWith(SpringExtension::class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class LocationRepositoryTests @Autowired constructor(
    val locationRepo: LocationRepository
) {
    @Test
    fun findAll() {
        // arrange
        // act
        val locations = locationRepo.findAll()?.toList()

        // assert
        expect(locations).has.size(3)
        expect(locations).to.contain(
            Location(
                "NYC",
                ZoneId.of("America/New_York"),
                "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
            )
        )
    }

    @Test
    fun findOne() {
        // arrange
        // act
        val location = locationRepo.findOne("b1177996-75e2-41da-a3e9-fcdd75d1ab31")

        // assert
        expect(location).to.equal(
            Location(
                "NYC",
                ZoneId.of("America/New_York"),
                "b1177996-75e2-41da-a3e9-fcdd75d1ab31"
            )
        )
    }

    @Test
    fun findOneNotExist() {
        // arrange
        // act
        val location = locationRepo.findOne("foo")

        // assert
        expect(location).to.be.`null`
    }
}
