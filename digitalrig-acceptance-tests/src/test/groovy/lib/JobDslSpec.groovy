import hudson.FilePath
import hudson.model.Executor
import javaposse.jobdsl.dsl.DslScriptLoader
import javaposse.jobdsl.dsl.GeneratedItems
import javaposse.jobdsl.plugin.JenkinsJobManagement
import org.junit.ClassRule
import org.jvnet.hudson.test.JenkinsRule
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class JobDslSpec extends Specification {
    @Shared
    @ClassRule
    JenkinsRule jenkinsRule = new JenkinsRule()

    @Unroll
    def 'test jobdsl #file.name'(File file) {
        setup:
        def executor = Mock(Executor)
        Executor.IMPERSONATION.set(executor)
        executor.getCurrentWorkspace() >> new FilePath(new File('.'))
        def jobManagement = new JenkinsJobManagement(System.out, [:], new File('.'))

        when:
        def items = new DslScriptLoader(jobManagement).runScript(file.text)

        then:
        !items.jobs.empty

        where:
        file << jobFiles
    }

    static List<File> getJobFiles() {
        List<File> files = []
        new File('jobs').eachFileRecurse {
            if (it.name.endsWith('.groovy')) {
                files << it
            }
        }
        files
    }
}