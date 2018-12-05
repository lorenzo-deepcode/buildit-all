package com.buildit.bookit.v1.user

import com.buildit.bookit.auth.UserPrincipal
import com.buildit.bookit.v1.user.dto.User
import org.springframework.stereotype.Service

@Service
class UserService(val userRepository: UserRepository) {
    /**
     * Obtains the Bookit user representa
     */
    fun register(principal: UserPrincipal): User =
        userRepository.findByExternalId(principal.subject)
                ?: userRepository.save(User(principal.subject, principal.givenName, principal.familyName))
}
