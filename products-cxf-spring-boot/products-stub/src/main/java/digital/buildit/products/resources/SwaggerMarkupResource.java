package digital.buildit.products.resources;

import io.github.swagger2markup.Swagger2MarkupConfig;
import io.github.swagger2markup.Swagger2MarkupConverter;
import io.github.swagger2markup.builder.Swagger2MarkupConfigBuilder;
import io.github.swagger2markup.markup.builder.MarkupLanguage;
import org.springframework.stereotype.Service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import java.net.URL;

@Service
public class SwaggerMarkupResource {

    private static final String SWAGGER_RESOURCE_PATH = "/swagger.json";

    @Context
    private UriInfo uri;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/swagger.md")
    public String generateMarkdown() throws Exception {
        return generate(MarkupLanguage.MARKDOWN);
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/swagger.cmu")
    public String generateConfluenceMarkup() throws Exception {
        return generate(MarkupLanguage.CONFLUENCE_MARKUP);
    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/swagger.ad")
    public String generateAsciDoc() throws Exception {
        return generate(MarkupLanguage.ASCIIDOC);
    }


    protected String generate(MarkupLanguage markupLanguage) throws Exception {
        Swagger2MarkupConfig config = new Swagger2MarkupConfigBuilder()
                .withMarkupLanguage(markupLanguage)
                .build();
        String markup = Swagger2MarkupConverter.from(getSwaggerURL())
                .withConfig(config)
                .build()
                .toString();
        return markup;
    }

    protected URL getSwaggerURL() throws Exception {
        String absolutePath = uri.getAbsolutePath().toString();
        String basePath = absolutePath.substring(0, absolutePath.lastIndexOf("/"));
        return new URL(basePath + SWAGGER_RESOURCE_PATH);
    }

}
