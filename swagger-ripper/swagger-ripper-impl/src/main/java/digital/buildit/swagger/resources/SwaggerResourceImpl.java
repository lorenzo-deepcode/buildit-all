package digital.buildit.swagger.resources;

import digital.buildit.swagger.domain.Swagger;
import digital.buildit.swagger.repository.SwaggerRepository;
import digital.buildit.swagger.utilities.SwaggerExtractor;
import org.apache.cxf.common.i18n.Exception;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

@Service
public class SwaggerResourceImpl implements SwaggerResource {

    @Autowired
    private SwaggerRepository repository;

    @Autowired
    private SwaggerExtractor swaggerExtractor;

    public Collection<Swagger> getAll() {
        return repository.findAll();
    }

    public String get(String id) {
        return repository.findById(id);
    }

    public void delete(String id) {
         repository.delete(id);
    }

    public void delete() {
        repository.purge();
    }

    public void save(@Multipart("file") Attachment attachment) throws Exception, IOException {
        repository.save(swaggerExtractor.extractSwagger(attachment.getObject(InputStream.class)));
    }
}
