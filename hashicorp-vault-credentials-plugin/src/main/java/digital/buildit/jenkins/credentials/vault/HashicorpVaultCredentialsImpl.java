package digital.buildit.jenkins.credentials.vault;

import com.cloudbees.plugins.credentials.*;
import com.cloudbees.plugins.credentials.common.StandardUsernamePasswordCredentials;
import com.cloudbees.plugins.credentials.domains.DomainRequirement;
import com.cloudbees.plugins.credentials.impl.BaseStandardCredentials;
import com.cloudbees.plugins.credentials.matchers.IdMatcher;
import com.datapipe.jenkins.vault.VaultAccessor;
import com.datapipe.jenkins.vault.VaultBuildWrapper;
import com.datapipe.jenkins.vault.configuration.GlobalVaultConfiguration;
import com.datapipe.jenkins.vault.credentials.VaultCredential;
import com.datapipe.jenkins.vault.exception.VaultPluginException;
import edu.umd.cs.findbugs.annotations.CheckForNull;
import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Extension;
import hudson.ExtensionList;
import hudson.security.ACL;
import hudson.util.Secret;
import jenkins.model.GlobalConfiguration;
import jenkins.model.Jenkins;
import org.apache.commons.lang.StringUtils;
import org.kohsuke.stapler.DataBoundConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

public class HashicorpVaultCredentialsImpl extends BaseStandardCredentials implements HashicorpVaultCredentials, StandardUsernamePasswordCredentials {

    public static final String DEFAULT_USERNAME_KEY = "username";
    public static final String DEFAULT_PASSWORD_KEY = "password";
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(HashicorpVaultCredentialsImpl.class.getName());
    private String key;
    private String usernameKey;
    private String passwordKey;

    @DataBoundConstructor
    public HashicorpVaultCredentialsImpl(@CheckForNull CredentialsScope scope, @CheckForNull String id,
                                         @CheckForNull String key, @CheckForNull String passwordKey, @CheckForNull String usernameKey, @CheckForNull String description) {
        super(scope, id, description);
        this.key = key;
        this.usernameKey = StringUtils.isEmpty(usernameKey) ? DEFAULT_USERNAME_KEY : usernameKey;
        this.passwordKey = StringUtils.isEmpty(passwordKey) ? DEFAULT_PASSWORD_KEY : passwordKey;
    }

    @Override
    public String getDisplayName() {
        return this.key;
    }

    @NonNull
    @Override
    public Secret getPassword() {
        return Secret.fromString(getValue(this.passwordKey));
    }

    private String getValue(String valueKey) {
        GlobalVaultConfiguration globalConfig = GlobalConfiguration.all().get(GlobalVaultConfiguration.class);


        ExtensionList<VaultBuildWrapper.DescriptorImpl> extensionList = Jenkins.getInstance().getExtensionList(VaultBuildWrapper.DescriptorImpl.class);
        VaultBuildWrapper.DescriptorImpl descriptor = extensionList.get(0);

        if (descriptor == null) {
            throw new IllegalStateException("Vault plugin has not been configured.");
        }

        try {

            VaultAccessor vaultAccessor = new VaultAccessor();

            vaultAccessor.init(globalConfig.getConfiguration().getVaultUrl());
            VaultCredential vaultCredential = retrieveVaultCredentials(globalConfig.getConfiguration().getVaultCredentialId());
            vaultAccessor.auth(vaultCredential);

            LOGGER.log(Level.FINE, "Fetching value " + key + " from vault: " + globalConfig.getConfiguration().getVaultUrl());

            Map<String, String> values = vaultAccessor.read(key);

            return values.get(valueKey);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private VaultCredential retrieveVaultCredentials(String id) {
        if (StringUtils.isBlank(id)) {
            throw new VaultPluginException("The credential id was not configured - please specify the credentials to use.");
        }
        List<VaultCredential> credentials = CredentialsProvider.lookupCredentials(VaultCredential.class, Jenkins.getInstance(), ACL.SYSTEM, Collections.<DomainRequirement>emptyList());
        VaultCredential credential = CredentialsMatchers.firstOrNull(credentials, new IdMatcher(id));

        if (credential == null) {
            throw new CredentialsUnavailableException(id);
        }

        return credential;
    }

    @NonNull
    @Override
    public String getUsername() {
        return getValue(this.usernameKey);
    }

    @NonNull
    public String getPasswordKey() {
        return passwordKey;
    }

    public void setPasswordKey(String passwordKey) {
        this.passwordKey = passwordKey;
    }

    @NonNull
    public String getUsernameKey() {
        return usernameKey;
    }

    public void setUsernameKey(String usernameKey) {
        this.usernameKey = usernameKey;
    }

    @NonNull
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Extension
    public static class DescriptorImpl extends CredentialsDescriptor {

        @Override
        public String getDisplayName() {
            return "Hashicorp Vault Credentials";
        }
    }
}
