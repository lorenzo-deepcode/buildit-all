package digital.buildit.products.resources;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.*;
import static org.junit.Assert.assertThat;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.ws.rs.core.UriInfo;
import java.net.URI;
import java.net.URL;

public class SwaggerMarkupResourceTest {

    private SwaggerMarkupResource swaggerMarkupResource = new SwaggerMarkupResource();

    @Test
    public void shouldCalculateSwaggerJsonUrl() throws Exception {
        UriInfo uriInfo = mock(UriInfo.class);
        when(uriInfo.getAbsolutePath()).thenReturn(new URI("http://localhost:8080/swagger.md"));
        ReflectionTestUtils.setField(swaggerMarkupResource, "uri", uriInfo);
        URL swaggerURL = swaggerMarkupResource.getSwaggerURL();
        assertThat(swaggerURL.toString(), equalTo("http://localhost:8080/swagger.json"));
    }
}
