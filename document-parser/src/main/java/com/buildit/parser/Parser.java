package com.buildit.parser;

import java.io.*;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.pdf.PDFParser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.ContentHandler;

public class Parser {

    public static String parse(InputStream is) throws Exception {

        org.apache.tika.parser.Parser parser = new PDFParser();

        StringWriter outputWriter = new StringWriter();
        ContentHandler handler = new BodyContentHandler(outputWriter);

        Metadata metadata = new Metadata();

        parser.parse(is, handler, metadata, new ParseContext());

        return outputWriter.toString();
    }
}
