package digital.buildit.products.resources;

import digital.buildit.products.domain.Product;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.UUID;

@Service
public class ProductsResourceImpl implements ProductsResource {

    public Collection<Product> getProducts() {
        LinkedHashSet<Product> products = new LinkedHashSet<Product>();
        products.add(new Product(UUID.randomUUID().toString(), "Wonderful Widget"));
        products.add(new Product(UUID.randomUUID().toString(), "Tantalizing Thingy"));
        return products;
    }

    public Product getProduct(String productId) {
        return new Product(UUID.randomUUID().toString(), "Wonderful Widget");
    }

    public Product saveProduct(Product product) {
        if(product.getId()==null){
            product.setId(UUID.randomUUID().toString());
        }
        return product;
    }
}
