package com.buildit.documents.repository;

import com.buildit.documents.model.Document;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import pl.allegro.tech.embeddedelasticsearch.EmbeddedElastic;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static pl.allegro.tech.embeddedelasticsearch.PopularProperties.TRANSPORT_TCP_PORT;

public class DocumentRepositoryTest {

    private static final String ELASTIC_VERSION = "6.0.1";
    private static final Integer TRANSPORT_TCP_PORT_VALUE = 9930;


    private EmbeddedElastic embeddedElastic;
    private DocumentRepository documentRepository;

    @Before
    public void setUp() throws Exception {
        embeddedElastic = EmbeddedElastic.builder()
                .withElasticVersion(ELASTIC_VERSION)
                .withSetting(TRANSPORT_TCP_PORT, TRANSPORT_TCP_PORT_VALUE)
                .withEsJavaOpts("-Xms128m -Xmx512m")
                .build()
                .start();

        documentRepository = DocumentRepository.builder()
                .withServerUrl("http://localhost:" + embeddedElastic.getHttpPort())
                .build();
    }

    @Test
    public void testInsertAndFindById() throws Exception {
        Document document = new Document();
        document.setContent("Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed.");
        document.setTitle("Ulysses");

        String id = documentRepository.insert(document);

        Document result = documentRepository.findById(id);

        assertThat(result).isEqualTo(document);
    }

    @Test
    public void testInsertAndFindAll() throws Exception {
        Document firstDocument = new Document();
        firstDocument.setContent("I am by birth a Genevese, and my family is one of the most distinguished of that republic.");
        firstDocument.setTitle("Frankenstein");
        documentRepository.insert(firstDocument);

        Document secondDocument = new Document();
        secondDocument.setContent("My father had a small estate in Nottinghamshire: I was the third of five sons.");
        secondDocument.setTitle("Gulliver's Travels");
        documentRepository.insert(secondDocument);

        embeddedElastic.refreshIndices();

        List<Document> result = documentRepository.findAll();

        assertThat(result.size()).isEqualTo(2);
    }

    @Test
    public void testInsertAndFindAllByQuery() throws Exception {
        Document firstDocument = new Document();
        firstDocument.setContent("I am by birth a Genevese, and my family is one of the most distinguished of that republic.");
        firstDocument.setTitle("Frankenstein");
        documentRepository.insert(firstDocument);

        Document secondDocument = new Document();
        secondDocument.setContent("My father had a small estate in Nottinghamshire: I was the third of five sons.");
        secondDocument.setTitle("Gulliver's Travels");
        documentRepository.insert(secondDocument);

        embeddedElastic.refreshIndices();

        List<Document> result = documentRepository.findAll("Genevese");

        assertThat(result.size()).isEqualTo(1);
    }

    @Test
    public void testInsertAndFindAllByQueryEscapesQuotes() throws Exception {
        Document firstDocument = new Document();
        firstDocument.setContent("\"To be born again,\" sang Gibreel Farishta tumbling from the heavens, \"first you have to die.\"");
        firstDocument.setTitle("The Satanic Verses");
        documentRepository.insert(firstDocument);

        embeddedElastic.refreshIndices();

        List<Document> result = documentRepository.findAll("\"To be born again,\"");

        assertThat(result.size()).isEqualTo(1);
    }

    @Test
    public void testInsertAndFindAllByQueryBoostsTitleField() throws Exception {

        Document firstDocument = new Document();
        firstDocument.setTitle("Never Let Me Go");
        firstDocument.setContent("My name is Kathy H. I am thirty-one years old, and I've been a carer now for over eleven years.");
        documentRepository.insert(firstDocument);

        Document secondDocument = new Document();
        secondDocument.setTitle("100 Years of Solitude");
        secondDocument.setContent("Many years later, as he faced the firing squad, " +
                "Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.");
        documentRepository.insert(secondDocument);


        embeddedElastic.refreshIndices();

        List<Document> result = documentRepository.findAll("years");

        assertThat(result.size()).isEqualTo(2);
        assertThat(result.get(0).getTitle()).isEqualTo(secondDocument.getTitle());
        assertThat(result.get(1).getTitle()).isEqualTo(firstDocument.getTitle());

    }

    @After
    public void tearDown() throws Exception {
        embeddedElastic.stop();
    }
}
