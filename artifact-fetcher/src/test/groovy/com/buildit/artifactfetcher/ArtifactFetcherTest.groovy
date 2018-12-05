package com.buildit.artifactfetcher

import com.buildit.artifactfetcher.utils.FreePort
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder

import java.security.DigestInputStream
import java.security.MessageDigest

import static org.hamcrest.CoreMatchers.equalTo
import static org.junit.Assert.assertThat
import static com.buildit.artifactfetcher.utils.HttpServer.withServer
import static com.buildit.artifactfetcher.utils.ResourcePath.resourcePath

class ArtifactFetcherTest {

    private static final String SERVER_PORT = FreePort.nextFreePort(8000, 9000)
    private static final String SERVER_ADDRESS = "http://localhost:${SERVER_PORT}"

    @Rule
    public TemporaryFolder folder = new TemporaryFolder()

    private ArtifactFetcher artifactFetcher = new ArtifactFetcher()

    @Test
    void shouldFetchArtifact(){
        def serverPath = resourcePath("", "artifacts") as String
        def artifactPath = resourcePath("jenkins-startup-scripts-2.0.0.zip", "artifacts/com/buildit/jenkins-startup-scripts/2.0.0") as String
        def artifact = new File(artifactPath as String)
        def artifactHash = hashFile(artifact)
        withServer(serverPath, SERVER_PORT) {
            def result = artifactFetcher.fetch("${SERVER_ADDRESS}/[organisation]/[module]/[revision]/[artifact]-[revision].[ext]", ["com.buildit:jenkins-startup-scripts:2.0.0@zip"], folder.newFolder())
            def resultHash = hashFile(result[0])
            assertThat(resultHash, equalTo(artifactHash))
        }
    }

    def hashFile(File file) {
        file.withInputStream {
            new DigestInputStream(it, MessageDigest.getInstance('MD5')).withStream {
                it.eachByte {}
                it.messageDigest.digest().encodeHex() as String
            }
        }
    }
}