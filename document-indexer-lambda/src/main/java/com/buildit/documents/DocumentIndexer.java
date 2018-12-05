package com.buildit.documents;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.event.S3EventNotification.S3EventNotificationRecord;
import com.amazonaws.services.s3.model.S3Object;

import com.buildit.documents.model.Document;
import com.buildit.documents.repository.DocumentRepository;
import com.buildit.parser.Parser;

import java.net.URLDecoder;

public class DocumentIndexer implements RequestHandler<S3Event, String> {

    private DocumentRepository documentRepository;

    public DocumentIndexer() throws Exception {
        documentRepository = DocumentRepository.builder()
                .withServerUrl(System.getenv("DOCUMENT_INDEX"))
                .withAccessKey(System.getenv("ACCESS_KEY"))
                .withSecretKey(System.getenv("SECRET_KEY"))
                .build();
    }

    public String handleRequest(S3Event s3event, Context context) {
        try {
            S3EventNotificationRecord record = s3event.getRecords().get(0);

            String bkt = record.getS3().getBucket().getName();
            String key = record.getS3().getObject().getKey().replace('+', ' ');
            key = URLDecoder.decode(key, "UTF-8");

            AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();

            S3Object object = s3Client.getObject(bkt, key);
            String body = Parser.parse(object.getObjectContent());
            Document document = new Document();
            document.setTitle(key);
            document.setContent(body);
            document.setUrl(s3Client.getUrl(bkt, key).toString());
            documentRepository.insert(document);
            return "ok";
        } catch (Exception e) {
            System.err.println("Exception: " + e);
            e.printStackTrace();
            return "error";
        }

    }
}