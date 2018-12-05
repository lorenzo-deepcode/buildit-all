package com.wiprodigital;

import com.wiprodigital.confluence.ConfluenceApi;
import com.wiprodigital.confluence.domain.Content;
import com.wiprodigital.confluence.domain.SearchContentResults;
import com.wiprodigital.confluence.domain.Version;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.ResponseBody;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.logging.Log;
import org.apache.maven.settings.Server;
import org.apache.maven.settings.Settings;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import retrofit2.Call;
import retrofit2.Response;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.Properties;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ConfluenceMojoTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    Log logger;

    @Mock
    ConfluenceApi confluenceApi;

    @Test
    public void shouldFailExecution_whenNoServerIdFoundInMavenSettings()
            throws MojoFailureException, MojoExecutionException {

        final ConfluenceMojo confluenceMojo = new ConfluenceMojo();
        confluenceMojo.setCredentialsServerId("a-server-id");
        confluenceMojo.setSettings(emptySettings());

        expectedException.expect(MojoExecutionException.class);
        expectedException.expectMessage(equalTo("Couldn't find server with ID 'a-server-id' in maven settings.xml"));

        confluenceMojo.execute();
    }

    @Test
    public void shouldLogError_whenNotAbleToReadFile()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojo(confluenceApi, logger, "non-existing.wiki");
        expectedException.expect(MojoExecutionException.class);
        expectedException.expectMessage(equalTo("Document content file not found, aborting"));

        confluenceMojo.execute();

        verify(logger).error(startsWith("Problem reading file 'non-existing.wiki'."), any(Exception.class));
    }

    @Test
    public void shouldLogError_whenNetworkProblemDuringSearchCall()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        expectedException.expect(MojoExecutionException.class);
        expectedException.expectMessage(equalTo("Confluence API call failed, aborting"));

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new CallWithNetworkError<SearchContentResults>());

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojo(confluenceApi, logger, resource.getFile());
        confluenceMojo.execute();

        verify(logger).error(eq("Error searching for document 'API Documentation' in space 'foo'."), any(IOException.class));
    }

    @Test
    public void shouldLogError_whenServerErrorDuringSearchCall()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        expectedException.expect(MojoExecutionException.class);
        expectedException.expectMessage(equalTo("Confluence API call failed, aborting"));

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new ErrorResponse<SearchContentResults>(500, "{\"message\": an error}"));

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojo(confluenceApi, logger, resource.getFile());
        confluenceMojo.execute();

        verify(logger).error("Error updating 'API Documentation' status=500 error={\"message\": an error}");
    }

    @Test
    public void shouldUpdateDocument_ifAlreadyExisting()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        final Content content = new Content.Builder()
                .withId("1")
                .withTitle("foo")
                .withVersion(new Version.Builder().withNumber(1).build())
                .build();

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new SuccessfulResponse<SearchContentResults>(searchContentResultsWithOneDocument(content)));

        when(confluenceApi.update(anyString(), any(Content.class)))
                .thenReturn(new SuccessfulResponse<Content>(new Content.Builder().withId("1").build()));

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojo(confluenceApi, logger, resource.getFile());
        confluenceMojo.execute();

        verify(logger).info("Checking if 'API Documentation' document exists in space 'foo'...");
        verify(logger).info("'API Documentation' already exists with id '1' in space 'foo', updating...");
        verify(logger).info("'API Documentation' updated in space 'foo' with ancestor '12345'!");
    }

    @Test
    public void shouldCreateDocument_ifNonExisting()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new SuccessfulResponse<SearchContentResults>(emptySearchContentResults()));

        when(confluenceApi.create(any(Content.class)))
                .thenReturn(new SuccessfulResponse<Content>(new Content.Builder().withId("1").build()));

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojo(confluenceApi, logger, resource.getFile());
        confluenceMojo.execute();

        verify(logger).info("Checking if 'API Documentation' document exists in space 'foo'...");
        verify(logger).info("Creating 'API Documentation' in space 'foo'...");
        verify(logger).info("'API Documentation' created in space 'foo' with ancestor '12345'!");
    }

    @Test
    public void shouldCreateParentDocument_ifSpecifiedAndNonExisting()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new SuccessfulResponse<SearchContentResults>(emptySearchContentResults()));

        when(confluenceApi.create(any(Content.class)))
                .thenReturn(new SuccessfulResponse<Content>(new Content.Builder().withId("1").build()));

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojoWithParent(
                confluenceApi, logger, "Parent Document Title", resource.getFile(), resource.getFile());
        confluenceMojo.execute();

        verify(logger).info("Checking if 'Parent Document Title' document exists in space 'foo'...");
        verify(logger).info("Creating 'Parent Document Title' in space 'foo'...");
        verify(logger).info("'Parent Document Title' created in space 'foo' with ancestor '12345'!");
    }

    @Test
    public void shouldUpdateParentDocument_ifSpecifiedAndNonExisting()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        final Content parentDocument = new Content.Builder()
                .withId("1")
                .withTitle("Parent Document Title")
                .withVersion(new Version.Builder().withNumber(1).build())
                .build();

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new SuccessfulResponse<SearchContentResults>(searchContentResultsWithOneDocument(parentDocument)));

        when(confluenceApi.update(eq(parentDocument.getId()), any(Content.class)))
                .thenReturn(new SuccessfulResponse<Content>(new Content.Builder().withId(parentDocument.getId()).build()));

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojoWithParent(
                confluenceApi, logger, "Parent Document Title", resource.getFile(), resource.getFile());
        confluenceMojo.execute();

        verify(logger).info("Checking if 'Parent Document Title' document exists in space 'foo'...");
        verify(logger).info("'Parent Document Title' already exists with id '1' in space 'foo', updating...");
        verify(logger).info("'Parent Document Title' updated in space 'foo' with ancestor '12345'!");
    }

    @Test
    public void shouldFailExecution_whenNotAbleToCreateOrCreateParent()
            throws MojoFailureException, MojoExecutionException, MalformedURLException {
        final URL resource = getClass().getClassLoader().getResource("existing.wiki");
        assertNotNull(resource);

        when(confluenceApi.search(anyString(), anyString(), anyString()))
                .thenReturn(new CallWithNetworkError<SearchContentResults>());
        expectedException.expect(MojoExecutionException.class);
        expectedException.expectMessage(equalTo("Confluence API call failed, aborting"));

        final ConfluenceMojo confluenceMojo = correctlySetupConfluenceMojoWithParent(
                confluenceApi, logger, "Parent Document Title", resource.getFile(), resource.getFile());

        confluenceMojo.execute();
    }

    private static SearchContentResults emptySearchContentResults() {
        return new SearchContentResults.Builder().build();
    }

    private static SearchContentResults searchContentResultsWithOneDocument(Content content) {
        return new SearchContentResults.Builder()
                .withResults(Collections.singletonList(content))
                .build();
    }

    private static ConfluenceMojo correctlySetupConfluenceMojo(
            ConfluenceApi confluenceApi, Log logger, String documentFile) throws MalformedURLException {
        final ConfluenceMojo confluenceMojo = new ConfluenceMojo();
        confluenceMojo.setCredentialsServerId("a-server-id");
        confluenceMojo.setSettings(settingsWithServer(server("a-server-id", "user", "pass")));
        confluenceMojo.setApiBaseUrl(new URL("https://foo.atlassian.net/wiki/rest/api/content/"));
        confluenceMojo.setReadTimeoutMs(3000);
        confluenceMojo.setConnectionTimeoutMs(3000);
        confluenceMojo.setSpaceKey("foo");
        confluenceMojo.setDocuments(oneDocument("API Documentation", documentFile));
        confluenceMojo.setLog(logger);
        confluenceMojo.setConfluenceApi(confluenceApi);
        confluenceMojo.setAncestorId("12345");
        return confluenceMojo;
    }

    private static ConfluenceMojo correctlySetupConfluenceMojoWithParent(
            ConfluenceApi confluenceApi, Log logger, String parentDocumentTitle,
            String parentDocumentContent, String documentFile) throws MalformedURLException {
        final ConfluenceMojo confluenceMojo = new ConfluenceMojo();
        confluenceMojo.setCredentialsServerId("a-server-id");
        confluenceMojo.setSettings(settingsWithServer(server("a-server-id", "user", "pass")));
        confluenceMojo.setApiBaseUrl(new URL("https://foo.atlassian.net/wiki/rest/api/content/"));
        confluenceMojo.setReadTimeoutMs(3000);
        confluenceMojo.setConnectionTimeoutMs(3000);
        confluenceMojo.setSpaceKey("foo");
        confluenceMojo.setDocuments(oneDocument("API Documentation", documentFile));
        confluenceMojo.setLog(logger);
        confluenceMojo.setConfluenceApi(confluenceApi);
        confluenceMojo.setAncestorId("12345");
        confluenceMojo.setCreateParent(true);
        confluenceMojo.setParentTitle(parentDocumentTitle);
        confluenceMojo.setParentContentFile(parentDocumentContent);
        return confluenceMojo;
    }

    private static Settings emptySettings() {
        return new Settings();
    }

    private static Settings settingsWithServer(Server server) {
        final Settings settings = new Settings();
        settings.addServer(server);
        return settings;
    }

    private static Server server(String id, String username, String password) {
        final Server server = new Server();
        server.setId(id);
        server.setUsername(username);
        server.setPassword(password);
        return server;
    }

    private static Properties oneDocument(String name, String file) {
        final Properties properties = new Properties();
        properties.setProperty(name, file);
        return properties;
    }

    private static class CallWithNetworkError<T> implements Call<T> {

        public retrofit2.Response<T> execute() throws IOException {
            throw new IOException();
        }

        public void enqueue(retrofit2.Callback<T> callback) {

        }

        public boolean isExecuted() {
            return false;
        }

        public void cancel() {

        }

        public boolean isCanceled() {
            return false;
        }

        public Call<T> clone() {
            return null;
        }

        public Request request() {
            return null;
        }
    }

    private static class SuccessfulResponse<T> implements Call<T> {

        private final T fakeResponse;

        public SuccessfulResponse(T fakeResponse) {
            this.fakeResponse = fakeResponse;
        }

        public Response<T> execute() throws IOException {
            return Response.success(fakeResponse);
        }

        public void enqueue(retrofit2.Callback callback) {

        }

        public boolean isExecuted() {
            return false;
        }

        public void cancel() {

        }

        public boolean isCanceled() {
            return false;
        }

        public Call clone() {
            return null;
        }

        public Request request() {
            return null;
        }
    }

    private static class ErrorResponse<T> implements Call<T> {

        private final int errorCode;
        private final String jsonError;

        public ErrorResponse(int errorCode, String jsonError) {
            this.errorCode = errorCode;
            this.jsonError = jsonError;
        }

        public Response<T> execute() throws IOException {
            final ResponseBody body = ResponseBody.create(MediaType.parse("application/json"), jsonError);
            return Response.error(errorCode, body);
        }

        public void enqueue(retrofit2.Callback callback) {

        }

        public boolean isExecuted() {
            return false;
        }

        public void cancel() {

        }

        public boolean isCanceled() {
            return false;
        }

        public Call clone() {
            return null;
        }

        public Request request() {
            return null;
        }
    }

}