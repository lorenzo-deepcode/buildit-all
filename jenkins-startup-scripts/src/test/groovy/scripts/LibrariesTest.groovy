package scripts

import jenkins.model.Jenkins
import org.junit.BeforeClass
import org.junit.Test
import org.jvnet.hudson.test.recipes.LocalData
import org.jvnet.hudson.test.recipes.WithPlugin
import utilities.ZipTestFiles

import static org.hamcrest.Matchers.equalTo
import static org.junit.Assert.assertThat

class LibrariesTest extends StartupTest {

    @BeforeClass
    public static void setUp() {
        setUp(LibrariesTest.class, ["scripts/libraries.groovy", "scripts/credentials.groovy"])
    }

    @Test
    @LocalData
    @WithPlugin(["ace-editor-1.0.1.hpi", "jquery-detached-1.2.1.hpi", "workflow-cps-global-lib-2.9.hpi", "workflow-cps-2.53.hpi",
            "workflow-scm-step-2.6.hpi", "cloudbees-folder-6.4.hpi", "git-client-2.7.0.hpi", "git-server-1.7.hpi", "scm-api-2.2.6.hpi",
            "structs-1.14.hpi", "ssh-credentials-1.13.hpi", "credentials-2.1.16.hpi", "workflow-step-api-2.14.hpi",
            "workflow-api-2.27.hpi", "workflow-support-2.18.hpi", "ace-editor-1.0.1.hpi", "script-security-1.44.hpi",
            "git-3.7.0.hpi", "matrix-project-1.12.hpi", "mailer-1.20.hpi", "junit-1.23.hpi", "apache-httpcomponents-client-4-api-4.5.3-2.1.hpi",
            "jsch-0.1.54.1.hpi", "display-url-api-2.2.0.hpi", "mailer-1.20.hpi"])
    @ZipTestFiles(files = ["jenkins.config"])
    void shouldConfigureLibraryFromConfig() {
        def provider = Jenkins.instanceOrNull.getExtensionList('org.jenkinsci.plugins.workflow.libs.GlobalLibraries')[0]
        assertThat(provider.libraries.size() as int, equalTo(3))

        def foo = provider.libraries.get(0)
        assertThat(foo.name as String, equalTo("foo"))
        assertThat(foo.defaultVersion as String, equalTo("master"))
        assertThat(foo.implicit as boolean, equalTo(true))
        assertThat(foo.allowVersionOverride as boolean, equalTo(false))
        assertThat(foo.retriever.scm.remote as String, equalTo("https://git.example.com/foo.git"))
        assertThat(foo.retriever.scm.credentialsId as String, equalTo("git"))
        assertThat(foo.retriever.scm.traits.size() as int, equalTo(2))

        def bar = provider.libraries.get(1)
        assertThat(bar.name as String, equalTo("bar"))
        assertThat(bar.defaultVersion as String, equalTo("master"))
        assertThat(bar.implicit as boolean, equalTo(false))
        assertThat(bar.allowVersionOverride as boolean, equalTo(true))
        assertThat(bar.retriever.scm.remote as String, equalTo("https://git.example.com/bar.git"))

        def baz = provider.libraries.get(2)
        assertThat(baz.name as String, equalTo("baz"))
        assertThat(baz.defaultVersion as String, equalTo("master"))
        assertThat(baz.implicit as boolean, equalTo(false))
        assertThat(baz.allowVersionOverride as boolean, equalTo(true))
        assertThat(baz.retriever.scm.remote as String, equalTo("https://git.example.com/baz.git"))
        assertThat(baz.retriever.scm.traits.size() as int, equalTo(3))
        assertThat(baz.retriever.scm.traits.get(1).includes as String, equalTo("baz_test"))
    }
}
