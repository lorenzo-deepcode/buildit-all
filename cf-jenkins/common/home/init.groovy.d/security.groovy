import com.cloudbees.jenkins.plugins.sshcredentials.impl.*
import com.cloudbees.jenkins.plugins.sshcredentials.impl.*;
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.*;
import com.cloudbees.plugins.credentials.common.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.plugins.credentials.domains.*;
import com.cloudbees.plugins.credentials.impl.*
import com.cloudbees.plugins.credentials.impl.*;
import hudson.plugins.sshslaves.*;
import jenkins.model.*;

set_security('unsecured')

void set_security(String security_model) {
  def instance = Jenkins.getInstance()

  if (security_model == 'disabled') {
    instance.disableSecurity()
    return
  }

  def strategy
  def realm
  switch (security_model) {
    case 'full_control':
      strategy = new hudson.security.FullControlOnceLoggedInAuthorizationStrategy()
      realm = new hudson.security.HudsonPrivateSecurityRealm(false, false, null)
      break
    case 'unsecured':
      strategy = new hudson.security.AuthorizationStrategy.Unsecured()
      realm = new hudson.security.HudsonPrivateSecurityRealm(false, false, null)
      break
  }
  instance.setAuthorizationStrategy(strategy)
  instance.setSecurityRealm(realm)
}
