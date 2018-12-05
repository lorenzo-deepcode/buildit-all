package com.splunk.splunkjenkins.listeners;

import hudson.Extension;
import hudson.model.User;
import jenkins.security.SecurityListener;
import org.acegisecurity.userdetails.UserDetails;

import javax.annotation.Nonnull;

import static com.splunk.splunkjenkins.utils.LogEventHelper.logUserAction;

/**
 * Note: all the username are user id, not user full name
 */
@Extension
public class UserSecurityListener extends SecurityListener {
    @Override
    protected void authenticated(@Nonnull UserDetails details) {
        //covered by loggedIn
    }

    @Override
    protected void failedToAuthenticate(@Nonnull String username) {
        logUserAction(getFullName(username), Messages.audit_user_fail_auth());
    }

    @Override
    protected void loggedIn(@Nonnull String username) {
        logUserAction(getFullName(username), Messages.audit_user_login());
    }

    @Override
    protected void failedToLogIn(@Nonnull String username) {
        //covered by failedToAuthenticate
    }

    @Override
    protected void loggedOut(@Nonnull String username) {
        logUserAction(getFullName(username), Messages.audit_user_logout());
    }

    /**
     * @param username
     * @return full name
     */
    private String getFullName(String username) {
        //user may not exists when user failed to login
        User user = User.get(username);
        return user.getFullName();
    }
}
