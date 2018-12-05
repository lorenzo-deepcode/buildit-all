package digital.buildit.products.product.resources.resources;

import digital.buildit.products.domain.Product;
import digital.buildit.products.product.repository.ProductRepository;
import digital.buildit.products.resources.ProductsResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class ProductsResourceImpl implements ProductsResource {

    @Autowired
    private ProductRepository productRepository;

    public Collection<Product> getProducts() {
        return productRepository.findAll(null);
    }

    public Product getProduct(String productId) {
        return productRepository.findProductById(productId);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
