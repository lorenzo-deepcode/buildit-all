package com.buildit.bookit.v1.location.bookable

import com.buildit.bookit.v1.location.bookable.dto.Bookable
import com.buildit.bookit.v1.location.bookable.dto.Disposition
import com.buildit.bookit.v1.location.dto.Location
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZoneId

@ExtendWith(SpringExtension::class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class BookableRepositoryTests @Autowired constructor(
    val bookableRepo: BookableRepository
) {
    private final val nyc = Location("NYC", ZoneId.of("America/New_York"), "b1177996-75e2-41da-a3e9-fcdd75d1ab31")
    val red = Bookable(nyc, "Red Room", Disposition(), "aab6d676-d3cb-4b9b-b285-6e63058aeda8")

    @Test
    fun findAll() {
        val bookables = bookableRepo.findAll()?.toList()
        expect(bookables).has.size(19)
        expect(bookables).to.contain(red)
    }

    @Test
    fun findOne() {
        val bookable = bookableRepo.findOne(red.id)
        expect(bookable).to.equal(red)
    }

    @Test
    fun findByLocation() {
        val bookables = bookableRepo.findByLocation(nyc)
        expect(bookables.size).to.be.equal(7)
        expect(bookables).to.contain(red)
    }
}
