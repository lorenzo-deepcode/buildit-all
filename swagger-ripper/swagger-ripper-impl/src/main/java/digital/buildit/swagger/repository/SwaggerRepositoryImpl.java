package digital.buildit.swagger.repository;

import digital.buildit.swagger.domain.Swagger;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class SwaggerRepositoryImpl implements SwaggerRepository {

    Map<String, Swagger> swaggers = new LinkedHashMap<String, Swagger>();

    public Collection<Swagger> findAll() {
        return swaggers.values();
    }

    public String findById(String id) {
        return swaggers.get(id).getSwagger();
    }

    public void delete(String id) {
        swaggers.remove(id);
    }

    public Swagger save(Swagger swagger) {
        return swaggers.get(swagger.getId());
    }

    public Swagger save(String swaggerString) {
        Swagger swagger = new Swagger(generateID(), swaggerString);
        swaggers.put(swagger.getId(), swagger);
        return swagger;
    }

    public void purge() {
        swaggers = new TreeMap<String, Swagger>();
    }

    private String generateID(){
        return UUID.randomUUID().toString();
    }
}
