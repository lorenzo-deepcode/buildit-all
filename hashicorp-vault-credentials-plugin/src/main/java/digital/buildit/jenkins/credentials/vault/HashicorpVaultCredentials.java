package digital.buildit.jenkins.credentials.vault;

import com.cloudbees.plugins.credentials.CredentialsNameProvider;
import com.cloudbees.plugins.credentials.NameWith;
import com.cloudbees.plugins.credentials.common.StandardUsernameCredentials;
import com.cloudbees.plugins.credentials.common.UsernamePasswordCredentials;
import edu.umd.cs.findbugs.annotations.NonNull;
import hudson.Util;

@NameWith(value = HashicorpVaultCredentials.NameProvider.class, priority = 1)
public interface HashicorpVaultCredentials extends StandardUsernameCredentials, UsernamePasswordCredentials {

    String getDisplayName();

    class NameProvider extends CredentialsNameProvider<HashicorpVaultCredentials> {

        @NonNull
        @Override
        public String getName(@NonNull HashicorpVaultCredentials hashicorpVaultCredentials) {
            String description = Util.fixEmpty(hashicorpVaultCredentials.getDescription());
            return hashicorpVaultCredentials.getDisplayName() + (description == null ? "" : " (" + description + ")");
        }
    }
}
