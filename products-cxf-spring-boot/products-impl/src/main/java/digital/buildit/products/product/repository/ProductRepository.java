package digital.buildit.products.product.repository;


import digital.buildit.products.domain.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.Repository;

import java.util.Collection;

public interface ProductRepository extends Repository<Product, String> {

    Collection<Product> findAll(Specification<Product> specification);

    Product findProductById(String id);

    Product save(Product review);
}
