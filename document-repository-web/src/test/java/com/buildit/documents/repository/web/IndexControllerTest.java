package com.buildit.documents.repository.web;

import com.buildit.documents.model.Document;
import com.buildit.documents.repository.DocumentRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class IndexControllerTest {

    @Value("${local.server.port}")
    private int localServerPort;

    @Value("${api.path}")
    private String path;

    @Value("${server.servlet.context-path}")
    private String basePath;

    @Autowired
    private DocumentRepository documentRepository;

    @Test
    public void testFetchAll() throws Exception {
        String title = "One Flew Over the Cuckoo's Nest";
        Document doc = new Document();
        doc.setTitle(title);
        List<Document> result = Arrays.asList(doc);
        when(documentRepository.findAll()).thenReturn(result);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity <List<Document>> response = restTemplate.exchange("http://localhost:" + localServerPort + basePath + path,
                HttpMethod.GET, null, new ParameterizedTypeReference <List<Document>>(){});

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().get(0).getTitle()).isEqualTo(title);
    }

    @Test
    public void testFetchAllWithQueryString() throws Exception {
        String search = "Catcher";

        String title = "The Catcher in the Rye";
        Document doc = new Document();
        doc.setTitle(title);
        List<Document> result = Arrays.asList(doc);
        when(documentRepository.findAll(search)).thenReturn(result);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity <List<Document>> response = restTemplate.exchange("http://localhost:" + localServerPort + basePath + path + "?q=" + search,
                HttpMethod.GET, null, new ParameterizedTypeReference <List<Document>>(){});

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().get(0).getTitle()).isEqualTo(title);
    }

}