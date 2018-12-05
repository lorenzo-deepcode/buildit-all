package digital.buildit.swagger.repository;


import digital.buildit.swagger.domain.Swagger;

import java.util.Collection;

public interface SwaggerRepository {

    Collection<Swagger> findAll();

    String findById(String id);

    void delete(String id);

    Swagger save(Swagger swagger);

    Swagger save(String swagger);

    void purge();
}
