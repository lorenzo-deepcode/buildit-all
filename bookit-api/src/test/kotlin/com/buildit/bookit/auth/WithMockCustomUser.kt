package com.buildit.bookit.auth

import com.buildit.bookit.v1.user.dto.User
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.test.context.support.WithSecurityContext
import org.springframework.security.test.context.support.WithSecurityContextFactory
import java.lang.annotation.Inherited

@WithSecurityContext(factory = WithMockCustomUserSecurityContextFactory::class)
@Retention(AnnotationRetention.RUNTIME)
@Inherited
annotation class WithMockCustomUser(
    val id: String = "123abc",
    val givenName: String = "Fake",
    val familyName: String = "User",
    val externalId: String = "456xyz"
)

@Suppress("UnsafeCast")
fun Any.makeUser(): User {
    val annotation = this::class.annotations.single { it is WithMockCustomUser } as WithMockCustomUser

    return User(annotation.externalId, annotation.givenName, annotation.familyName, annotation.id)
}

class WithMockCustomUserSecurityContextFactory : WithSecurityContextFactory<WithMockCustomUser> {
    override fun createSecurityContext(customUser: WithMockCustomUser): SecurityContext {
        val context = SecurityContextHolder.createEmptyContext()

        val principal = UserPrincipal(customUser.externalId, customUser.familyName, customUser.givenName)
        val auth = UsernamePasswordAuthenticationToken(principal, null, emptyList())
        context.authentication = auth
        return context
    }
}
