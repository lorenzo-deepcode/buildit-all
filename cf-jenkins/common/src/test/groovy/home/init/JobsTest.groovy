package home.init

import hudson.model.FreeStyleProject
import org.junit.BeforeClass
import org.junit.Rule
import org.junit.Test
import org.jvnet.hudson.test.JenkinsRule
import org.jvnet.hudson.test.recipes.LocalData

import static org.hamcrest.core.IsNull.notNullValue
import static org.junit.Assert.assertThat
import static utilities.AddScriptToLocalDataZip.addScriptToLocalDataZip

class JobsTest {

    private static final String SCRIPT_NAME = "jobs.groovy"
    private static final String SCRIPT_PATH = "home/init.groovy.d"
    private static final String SCRIPT_TARGET = "init.groovy.d"

    @Rule
    public JenkinsRule jenkinsRule = new JenkinsRule()

    @BeforeClass
    public static void setUp(){
        addScriptToLocalDataZip(JobsTest.class, SCRIPT_NAME, SCRIPT_PATH, SCRIPT_TARGET)
    }

    @Test
    @LocalData
    void shouldCreateTestJob(){
        assertThat(jenkinsRule.jenkins.getItem("test"), notNullValue())
    }

    @Test(timeout = 30000L)
    @LocalData
    void shouldCreateAndRunSeedJob(){
        FreeStyleProject seed = jenkinsRule.jenkins.getItem("seed");
        while(jenkinsRule.jenkins.getQueue().getItems().size() > 0){
            sleep(500)
        }
        assertThat(seed.getBuilds().lastBuild, notNullValue())
    }

}