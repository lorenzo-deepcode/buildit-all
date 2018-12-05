package com.buildit.parser;

import org.junit.Test;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static com.buildit.parser.ResourcePath.resourcePath;
import static junit.framework.Assert.assertEquals;

public class ParserTest {

    @Test
    public void test() throws Exception {
        String result = Parser.parse(new FileInputStream(new File(resourcePath("hotel.pdf", ""))));
        assertEquals(readFile("result.txt"), result);
    }

    private static String readFile(String location) throws Exception {
        Path path = Paths.get(ParserTest.class.getClassLoader().getResource(location).toURI());
        StringBuilder data = new StringBuilder();
        Stream<String> lines = Files.lines(path);
        lines.forEach(line -> data.append(line).append("\n"));
        lines.close();
        return data.toString();
    }
}