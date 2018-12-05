package com.buildit.documents.repository.web;

import com.buildit.documents.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.elasticsearch.jest.JestAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfiguration {

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.es.domain}")
    private String domain;

    @Bean
    public DocumentRepository documentRepository() throws Exception {
            return DocumentRepository.builder()
                    .withServerUrl(domain)
                    .withAccessKey(accessKey)
                    .withSecretKey(secretKey)
                    .build();
    }
}
