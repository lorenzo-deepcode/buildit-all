package com.buildit.documents.repository.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class UploadController {

    @Autowired
    private S3Wrapper s3Wrapper;

    @PostMapping("/upload")
    public void upload(@RequestParam("file") MultipartFile file, HttpServletResponse response) throws IOException {
        s3Wrapper.upload(new MultipartFile[] {file});
        response.sendRedirect("/");
    }
}
