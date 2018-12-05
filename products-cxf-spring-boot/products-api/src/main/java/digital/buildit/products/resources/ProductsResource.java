package digital.buildit.products.resources;

import digital.buildit.products.domain.Product;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

@Path("/products")
@Api("/products")
public interface ProductsResource {

    @GET
    @Path(value = "/")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation("Get the list of all the products")
    Collection<Product> getProducts();

    @GET
    @Path(value = "/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation("Get a product by ID")
    Product getProduct(String productId);

    @POST
    @Path(value = "/")
    @Produces(MediaType.APPLICATION_JSON)
    @ApiOperation("Save the specified product")
    Product saveProduct(Product product);
}
