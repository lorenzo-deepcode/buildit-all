package com.buildit.documents.repository.web;

import com.buildit.documents.repository.DocumentRepository;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("test")
@Configuration
public class ApplicationConfiguration {

    @Bean
    public DocumentRepository documentRepository() throws Exception {
        return Mockito.mock(DocumentRepository.class);
    }
}
