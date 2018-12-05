package digital.buildit.swagger.resources;

import org.apache.cxf.common.i18n.Exception;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import digital.buildit.swagger.domain.Swagger;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.Collection;

@Path("/api")
@Api("/api")
public interface SwaggerResource {

    @GET
    @Path(value = "/")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation("Get the list of all the swagger specs")
    Collection<Swagger> getAll();

    @GET
    @Path(value = "/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    @ApiOperation("Get a swagger spec by ID")
    String get(@PathParam("id") String id);

    @DELETE
    @Path(value = "/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    @ApiOperation("Delete swagger spec")
    void delete(@PathParam("id") String id);

    @DELETE
    @Path(value = "/")
    @Produces(MediaType.TEXT_PLAIN)
    @ApiOperation("Delete all swagger specs")
    void delete();

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    void save(@Multipart("file") Attachment attachment) throws Exception, IOException;
}
