package digital.buildit.swagger.utilities;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

@Component
public class SwaggerExtractor {

    public String extractSwagger(InputStream in) throws IOException {

        File temp = File.createTempFile("swagger-", ".tmp");
        temp.deleteOnExit();

        IOUtils.copy(in, new FileOutputStream(temp));

        ZipFile zip = new ZipFile(temp);

        for (Enumeration e = zip.entries(); e.hasMoreElements(); ) {
            ZipEntry entry = (ZipEntry) e.nextElement();

            InputStream inputStream = zip.getInputStream(entry);
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream);

            if(isSwaggerFile(entry)){
                String result = getContents(inputStreamReader);
                temp.delete();
                return result;
            }
        }
        return null;
    }

    private boolean isSwaggerFile(ZipEntry entry) {
        return entry.getName().endsWith(".json") || entry.getName().endsWith(".yml") || entry.getName().endsWith(".yaml");
    }

    private String getContents(InputStreamReader inputStreamReader) throws IOException {
        return IOUtils.toString( inputStreamReader );
    }
}
