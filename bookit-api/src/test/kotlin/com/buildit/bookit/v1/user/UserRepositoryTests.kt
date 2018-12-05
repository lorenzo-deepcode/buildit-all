package com.buildit.bookit.v1.user

import com.buildit.bookit.v1.user.dto.User
import com.winterbe.expekt.expect
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.junit.jupiter.SpringExtension

/**
 * User controller unit tests
 */
@ExtendWith(SpringExtension::class)
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTests @Autowired constructor(
    val userRepo: UserRepository
) {

    @Test
    fun `all users`() {
        val users = userRepo.findAll()?.toList()
        expect(users).has.size(1) // User defined in data.sql
    }

    @Test
    fun `all users with added users`() {
        val user1 = userRepo.save(User("guid1", "Test1", "User1"))
        val user2 = userRepo.save(User("guid2", "Test2", "User2"))

        val allUsers = userRepo.findAll()?.toList()
        expect(allUsers).to.contain(user1)
        expect(allUsers).to.contain(user2)
    }

    @Test
    fun `single user`() {
        val createdUser = userRepo.save(User("guid", "Test", "User"))
        expect(createdUser.id).not.to.be.`null`
        expect(createdUser.name).to.be.equal("Test User")

        val readUser = userRepo.findOne(createdUser.id)
        expect(readUser).not.to.be.`null`
        expect(readUser.id).not.to.be.`null`
        expect(readUser.name).to.be.equal("Test User")
    }

    @Test
    fun `single user by external id`() {
        val createdUser = userRepo.save(User("guid", "Test", "User"))
        expect(createdUser.id).not.to.be.`null`
        expect(createdUser.name).to.be.equal("Test User")

        val readUser = userRepo.findByExternalId("guid")
        expect(readUser).not.to.be.`null`
        expect(readUser?.id).not.to.be.`null`
        expect(readUser?.name).to.be.equal("Test User")
    }
}
