package com.wiprodigital;

import com.wiprodigital.confluence.ConfluenceApi;
import com.wiprodigital.confluence.domain.*;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.settings.Server;
import org.apache.maven.settings.Settings;
import org.codehaus.plexus.util.FileUtils;
import retrofit2.Response;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Mojo(name = "publish-content")
public class ConfluenceMojo extends AbstractMojo {

    private static final String CONFLUENCE_API_CALL_MOJO_FAILURE_MSG = "Confluence API call failed, aborting";
    private static final String FILE_NOT_FOUND_MOJO_FAILURE_MSG = "Document content file not found, aborting";

    @Parameter(
            property = "apiBaseUrl",
            required = true)
    private URL apiBaseUrl;

    @Parameter(
            property = "connectionTimeoutMs",
            required = false)
    private long connectionTimeoutMs = 3000;

    @Parameter(
            property = "readTimeoutMs",
            required = false)
    private long readTimeoutMs = 6000;

    @Parameter(
            property = "credentialsServerId",
            required = true)
    private String credentialsServerId;

    @Parameter(
            property = "spaceKey",
            required = true)
    private String spaceKey;

    @Parameter(
            property = "ancestorId",
            required = false)
    private String ancestorId;

    @Parameter(
            property = "createParent",
            required = false)
    private boolean createParent = false;

    @Parameter(
            property = "parentTitle",
            required = false)
    private String parentTitle;

    @Parameter(
            property = "parentContentFile",
            required = false)
    private String parentContentFile;

    @Parameter(
            property = "type",
            required = true)
    private String type; // page, blogpost

    @Parameter(
            property = "representation",
            required = true)
    private String representation; // wiki, storage

    @Parameter(
            property = "documents",
            required = true)
    private Properties documents;

    @Parameter(
            property = "settings",
            required = true,
            readonly = true)
    protected Settings settings;

    private ConfluenceApi confluenceApi;

    void setSettings(Settings settings) {
        this.settings = settings;
    }

    void setApiBaseUrl(URL apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    void setConnectionTimeoutMs(long connectionTimeoutMs) {
        this.connectionTimeoutMs = connectionTimeoutMs;
    }

    void setReadTimeoutMs(long readTimeoutMs) {
        this.readTimeoutMs = readTimeoutMs;
    }

    void setCredentialsServerId(String credentialsServerId) {
        this.credentialsServerId = credentialsServerId;
    }

    void setSpaceKey(String spaceKey) {
        this.spaceKey = spaceKey;
    }

    void setAncestorId(String ancestorId) {
        this.ancestorId = ancestorId;
    }

    void setType(String type) {
        this.type = type;
    }

    void setRepresentation(String representation) {
        this.representation = representation;
    }

    void setDocuments(Properties documents) {
        this.documents = documents;
    }

    void setConfluenceApi(ConfluenceApi confluenceApi) {
        this.confluenceApi = confluenceApi;
    }

    void setCreateParent(boolean createParent) {
        this.createParent = createParent;
    }

    void setParentTitle(String parentTitle) {
        this.parentTitle = parentTitle;
    }

    void setParentContentFile(String parentContentFile) {
        this.parentContentFile = parentContentFile;
    }

    public void execute() throws MojoExecutionException, MojoFailureException {
        final Server server = settings.getServer(credentialsServerId);
        validateServerCredentials(server, credentialsServerId);

        if (confluenceApi == null) {
            confluenceApi = ComponentFactory.confluenceApi(
                    server.getUsername(), server.getPassword(), apiBaseUrl, readTimeoutMs, connectionTimeoutMs);
        }

        String parentId = null;
        if (createParent) {
            validateCreateParentMode(parentTitle, parentContentFile);
            parentId = processDocument(confluenceApi, this.ancestorId, parentTitle, parentContentFile);
        }

        final String ancestorId = (parentId == null) ? this.ancestorId : parentId;
        for (Map.Entry<String, String> documentEntry : propertiesToStringMap(documents).entrySet()) {
            processDocument(confluenceApi, ancestorId, documentEntry.getKey(), documentEntry.getValue());
        }
    }

    private static void validateServerCredentials(Server server, String credentialsServerId) throws MojoExecutionException {
        if (server == null) {
            throw new MojoExecutionException(String.format(
                    "Couldn't find server with ID '%s' in maven settings.xml", credentialsServerId));
        }
    }

    private static void validateCreateParentMode(String parentTitle, String parentContentFile) throws MojoExecutionException {
        if (parentTitle == null || parentTitle.isEmpty()
                || parentContentFile == null || parentContentFile.isEmpty()) {
            throw new MojoExecutionException("'parentTitle' and 'parentContentFile' are mandatory when 'createParent' is enabled.");
        }
    }

    private String processDocument(ConfluenceApi confluenceApi, String ancestorId, String title, String contentFile) throws MojoExecutionException {
        getLog().info(String.format("Checking if '%s' document exists in space '%s'...", title, spaceKey));

        final String fileContent;
        try {
            fileContent = FileUtils.fileRead(new File(contentFile));
        } catch (IOException e) {
            getLog().error(String.format("Problem reading file '%s'.", contentFile), e);
            throw new MojoExecutionException(FILE_NOT_FOUND_MOJO_FAILURE_MSG);
        }

        final Storage storage = new Storage.Builder()
                .withRepresentation(representation)
                .withValue(fileContent)
                .build();

        final Response<SearchContentResults> searchResponse;
        try {
            searchResponse = confluenceApi.search(spaceKey, title, "version").execute();
            getLog().debug(searchResponse.raw().toString());
        } catch (IOException e) {
            getLog().error(String.format("Error searching for document '%s' in space '%s'.", title, spaceKey), e);
            throw new MojoExecutionException(CONFLUENCE_API_CALL_MOJO_FAILURE_MSG);
        }

        if (!searchResponse.isSuccessful()) {
            final String error = errorFromResponse(searchResponse);
            getLog().error(String.format("Error updating '%s' status=%s error=%s", title, searchResponse.code(), error));
            throw new MojoExecutionException(CONFLUENCE_API_CALL_MOJO_FAILURE_MSG);
        }

        if (resultsFoundInSearch(searchResponse)) {
            final Content firstResult = searchResponse.body().getResults().get(0);
            getLog().info(String.format(
                    "'%s' already exists with id '%s' in space '%s', updating...",
                    title, firstResult.getId(), spaceKey));

            final Content content = new Content.Builder()
                    .withId(firstResult.getId())
                    .withVersion(new Version.Builder().withNumber(firstResult.getVersion().getNumber() + 1).build())
                    .withType(type)
                    .withTitle(title)
                    .withSpace(new Space.Builder().withKey(spaceKey).build())
                    .withBody(new Body.Builder().withStorage(storage).build())
                    .withAncestors(Collections.singletonList(new Content.Builder().withId(ancestorId).build()))
                    .build();

            final Response<Content> updateResponse;
            try {
                updateResponse = confluenceApi.update(firstResult.getId(), content).execute();
                getLog().debug(updateResponse.raw().toString());
            } catch (IOException e) {
                getLog().error(String.format("Error updating document '%s' in space '%s'.", title, spaceKey), e);
                throw new MojoExecutionException(CONFLUENCE_API_CALL_MOJO_FAILURE_MSG);
            }

            if (updateResponse.isSuccessful()) {
                getLog().info(String.format("'%s' updated in space '%s' with ancestor '%s'!", title, spaceKey, ancestorId));
            } else {
                final String error = errorFromResponse(updateResponse);
                getLog().error(String.format("Error updating '%s' status=%s error=%s", title, updateResponse.code(), error));
                throw new MojoExecutionException(CONFLUENCE_API_CALL_MOJO_FAILURE_MSG);
            }

            return updateResponse.body().getId();
        } else {
            getLog().info(String.format("Creating '%s' in space '%s'...", title, spaceKey));

            final Content content = new Content.Builder()
                    .withType(type)
                    .withTitle(title)
                    .withSpace(new Space.Builder().withKey(spaceKey).build())
                    .withBody(new Body.Builder().withStorage(storage).build())
                    .withAncestors(Collections.singletonList(new Content.Builder().withId(ancestorId).build()))
                    .build();

            final Response<Content> createResponse;
            try {
                createResponse = confluenceApi.create(content).execute();
            } catch (IOException e) {
                getLog().error(String.format("Error creating document '%s' in space '%s'.", title, spaceKey), e);
                throw new MojoExecutionException(CONFLUENCE_API_CALL_MOJO_FAILURE_MSG);
            }

            getLog().debug(createResponse.raw().toString());
            if (createResponse.isSuccessful()) {
                getLog().info(String.format("'%s' created in space '%s' with ancestor '%s'!", title, spaceKey, ancestorId));
            } else {
                final String error = errorFromResponse(createResponse);
                getLog().error(String.format("Error creating '%s': %s", title, error));
                throw new MojoExecutionException(CONFLUENCE_API_CALL_MOJO_FAILURE_MSG);
            }
            return createResponse.body().getId();
        }
    }

    private static boolean resultsFoundInSearch(Response<SearchContentResults> searchResponse) {
        return searchResponse.body() != null
                && searchResponse.body().getResults() != null
                && searchResponse.body().getResults().size() > 0;
    }

    private static String errorFromResponse(Response<?> response) {
        String error;
        try {
            error = response.errorBody().string();
        } catch (IOException e) {
            error = response.raw().toString();
        }
        return error;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private static Map<String, String> propertiesToStringMap(Properties properties) {
        return new HashMap(properties);
    }

}
