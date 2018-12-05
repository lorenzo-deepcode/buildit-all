package com.buildit.bookit.v1.user

import com.buildit.bookit.v1.user.dto.User

interface UserRepository : org.springframework.data.repository.CrudRepository<User, String> {
    fun findByExternalId(externalId: String): User?
}
