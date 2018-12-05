package com.buildit.documents.repository.web;

import com.buildit.documents.model.Document;
import com.buildit.documents.repository.DocumentRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
public class IndexController {

    @Autowired
    private DocumentRepository documentRepository;

    @RequestMapping(value = "${api.path}", method = RequestMethod.GET)
    public List<Document> index(@RequestParam(value = "q", required = false) String search) throws Exception {
        if(StringUtils.isNotEmpty(search)){
            return documentRepository.findAll(search);
        }
        return documentRepository.findAll();
    }
    
}
