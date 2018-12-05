package com.buildit.documents.repository;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.internal.StaticCredentialsProvider;
import com.buildit.documents.model.Document;
import com.google.common.base.Supplier;
import io.searchbox.action.Action;
import io.searchbox.client.JestClient;
import io.searchbox.client.JestClientFactory;
import io.searchbox.client.JestResult;
import io.searchbox.client.config.HttpClientConfig;
import io.searchbox.core.Get;
import io.searchbox.core.Index;
import io.searchbox.core.Search;
import io.searchbox.indices.CreateIndex;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vc.inreach.aws.request.AWSSigner;
import vc.inreach.aws.request.AWSSigningRequestInterceptor;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

public class DocumentRepository {

    private static Logger LOGGER = LoggerFactory.getLogger(DocumentRepository.class);

    private static final String INDEX_NAME = "documents";
    private static final String TYPE_NAME = "document";

    private JestClient client;

    public static Builder builder() {
        return new Builder();
    }

    private DocumentRepository() {}

    private DocumentRepository(String serverUrl, JestClientFactory factory) {
        factory.setHttpClientConfig(new HttpClientConfig
                .Builder(serverUrl)
                .multiThreaded(true)
                .readTimeout(60000)
                .build());
        client = factory.getObject();
        try {
            JestResult result = client.execute(new CreateIndex.Builder(INDEX_NAME).build());
            if (result.isSucceeded()) {
                LOGGER.debug("Index {} successfully created.", INDEX_NAME);
            } else {
                LOGGER.warn("Error while creating index. {}", INDEX_NAME);
            }
        }catch (IOException e){
            throw new DocumentRepositoryException(e.getMessage());
        }
    }

    private DocumentRepository(String serverUrl) {
        this(serverUrl, new JestClientFactory());
    }

    public String insert(Document document) {
        JestResult result = execute(new Index.Builder(document).index(INDEX_NAME).type(TYPE_NAME).build());
        return result.getJsonObject().get("_id").getAsString();
    }

    public Document findById(String id) {
        JestResult result = execute(new Get.Builder(INDEX_NAME, id).type(TYPE_NAME).build());
        return result.getSourceAsObject(Document.class);
    }

    public List<Document> findAll(String search) throws Exception {

        String safeSearch = StringUtils.replaceAll(search, "\"", "\\\\\"");

        String query = "{\n" +
                        "  \"query\": {\n" +
                        "    \"multi_match\" : {\n" +
                        "      \"query\" : \"" + safeSearch + "\",\n" +
                        "      \"fields\" : [ \"title^3\", \"content\" ] \n" +
                        "    }\n" +
                        "  }\n" +
                        "}";

        JestResult result = execute(new Search.Builder(query)
                .addIndex(INDEX_NAME)
                .build());

        return result.getSourceAsObjectList(Document.class);

    }

    public List<Document> findAll() throws Exception {

        JestResult result = execute(new Search.Builder("{\"query\" : {\"match_all\" : {}}}")
                .addIndex(INDEX_NAME)
                .build());

        return result.getSourceAsObjectList(Document.class);
    }

    private JestResult execute(Action<? extends JestResult> clientRequest){
        JestResult result;
        try {
            result = client.execute(clientRequest);
            if (!result.isSucceeded()) {
                LOGGER.error(result.getErrorMessage());
                throw new DocumentRepositoryException(result.getErrorMessage());
            }
        }catch (IOException e){
            throw new DocumentRepositoryException(e.getMessage());
        }
        return result;
    }

    public static class Builder {

        private String serverUrl;
        private String accessKey;
        private String secretKey;
        private String region = "us-east-1";
        private String serviceName = "es";
        private Supplier<LocalDateTime> clock = () -> LocalDateTime.now(ZoneOffset.UTC);

        public Builder withServerUrl(String serverUrl){
            this.serverUrl = serverUrl;
            return this;
        }

        public Builder withAccessKey(String accessKey){
            this.accessKey = accessKey;
            return this;
        }

        public Builder withSecretKey(String secretKey){
            this.secretKey = secretKey;
            return this;
        }

        public Builder withRegion(String region){
            this.region = region;
            return this;
        }

        public Builder withServiceName(String serviceName){
            this.serviceName = serviceName;
            return this;
        }

        public Builder withClock(Supplier<LocalDateTime> clock){
            this.clock = clock;
            return this;
        }

        public DocumentRepository build() throws Exception {
            if(this.accessKey == null){
                return new DocumentRepository(this.serverUrl);
            }
            AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
            AWSCredentialsProvider awsCredentialsProvider = new StaticCredentialsProvider(credentials);
            AWSSigner awsSigner = new AWSSigner(awsCredentialsProvider, this.region, this.serviceName, this.clock);

            final AWSSigningRequestInterceptor requestInterceptor = new AWSSigningRequestInterceptor(awsSigner);
            final JestClientFactory factory = new JestClientFactory() {
                @Override
                protected HttpClientBuilder configureHttpClient(HttpClientBuilder builder) {
                    builder.addInterceptorLast(requestInterceptor);
                    return builder;
                }
                @Override
                protected HttpAsyncClientBuilder configureHttpClient(HttpAsyncClientBuilder builder) {
                    builder.addInterceptorLast(requestInterceptor);
                    return builder;
                }
            };
            return new DocumentRepository(this.serverUrl, factory);
        }
    }
}
