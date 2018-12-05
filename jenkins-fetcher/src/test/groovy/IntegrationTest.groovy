import org.codehaus.groovy.control.CompilerConfiguration
import org.junit.ClassRule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import utilities.FreePort

import static org.assertj.core.api.Assertions.assertThat
import static utilities.HttpServer.startServer
import static utilities.ResourcePath.resourcePath

class IntegrationTest {

    @ClassRule
    public static TemporaryFolder folder = new TemporaryFolder()

    def script = load("scripts/main.groovy")

    @Test
    void shouldDownloadJenkinsWarFile(){
        String port = FreePort.nextFreePort(8000, 9000)
        File directory = folder.newFolder()
        File configFile = new File(directory, "jenkins.config")
        def jenkinsHome = configFile.parent
        System.metaClass.static.getenv = { String key ->
            return [JENKINS_HOME: jenkinsHome].get(key)
        }
        configFile.withWriter {  writer ->
            writer.write(
                    """
                    jenkins {
                        version {
                            artifactPattern = 'http://localhost:${port}/jenkins/war/[revision]/[module].[ext]'
                            artifact = ":jenkins:0.0@war"
                        }
                    }
                    """)
        }
        def serverPath = resourcePath("artifacts", "") as String
        def server = startServer(serverPath, port)
        def warLocation = script.run()
        assertThat(new File(warLocation)).exists()
        server.stop()
    }

    @Test(expected = IllegalArgumentException.class)
    void shouldThrowExceptionWhenWarFileIsMissing(){
        String port = FreePort.nextFreePort(8000, 9000)
        File directory = folder.newFolder()
        File configFile = new File(directory, "jenkins.config")
        def jenkinsHome = configFile.parent
        System.metaClass.static.getenv = { String key ->
            return [JENKINS_HOME: jenkinsHome].get(key)
        }
        configFile.withWriter {  writer ->
            writer.write(
                    """
                    jenkins {
                        version {
                            artifactPattern = 'http://localhost:${port}/jenkins/war/[revision]/[module].[ext]'
                            artifact = ":jenkins:0.1@war"
                        }
                    }
                    """)
        }
        def serverPath = resourcePath("artifacts", "") as String
        def server = startServer(serverPath, port)
        def warLocation = script.run()
        assertThat(new File(warLocation)).exists()
        server.stop()
    }

    @Test(expected = IllegalArgumentException.class)
    void shouldThrowExceptionWhenWarConfigIsMissing(){
        String port = FreePort.nextFreePort(8000, 9000)
        File directory = folder.newFolder()
        File configFile = new File(directory, "jenkins.config")
        def jenkinsHome = configFile.parent
        System.metaClass.static.getenv = { String key ->
            return [JENKINS_HOME: jenkinsHome].get(key)
        }
        configFile.withWriter {  writer ->
            writer.write(
                    """
                    // nothing here
                    """)
        }
        def serverPath = resourcePath("artifacts", "") as String
        def server = startServer(serverPath, port)
        def warLocation = script.run()
        assertThat(new File(warLocation)).exists()
        server.stop()
    }

    def load(script){
        CompilerConfiguration compilerConfiguration = new CompilerConfiguration()
        def shell = new GroovyShell(this.class.classLoader.rootLoader, new Binding(), compilerConfiguration)
        def file = new File("${script}")
        try{
            if(file.exists()){
                println("Loading script : ${file.absolutePath}")
                shell.getClassLoader().addURL(file.parentFile.toURI().toURL())
                def result = shell.evaluate("new " + file.name.split("\\.", 2)[0] + "()")
                return result
            }
        }catch(Exception e){
            println("Error loading script : ${e.getMessage()}")
            e.printStackTrace()
        }
    }
}
