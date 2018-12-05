package com.buildit.bookit

import com.winterbe.expekt.expect
import org.junit.jupiter.api.Test

/**
 * This test is dumb.  But so is not getting code coverage that's a bit more representative
 * https://youtrack.jetbrains.com/issue/KT-18383?preventRedirect=true
 * https://github.com/jacoco/jacoco/issues/552
 */
class BookitPropertiesTests {
    @Test
    fun `code coverage`() {
        expect(BookitProperties()).to.equal(BookitProperties())
    }
}
