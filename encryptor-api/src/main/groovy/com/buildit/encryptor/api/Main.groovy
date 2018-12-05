package com.buildit.encryptor.api

import spark.utils.IOUtils

import javax.servlet.MultipartConfigElement

import static com.buildit.encryptor.AESKeyGenerator.KeySize
import static com.buildit.encryptor.AESKeyGenerator.generate
import static spark.Spark.post
import static spark.Spark.staticFileLocation
import static com.buildit.encryptor.Encryptor.encrypt

class Main {

    public static final String SECRET_PARAM = "secret"
    public static final String PASSWORD_PARAM = "password"
    public static final String FILE_PARAM = "file"
    public static final String KEY_SIZE = "keySize"


    public static final String MULTIPART_CONFIG_ATTRIBUTE = "org.eclipse.jetty.multipartConfig"
    public static final String MULTIPART_CONTENT_TYPE = "multipart/form-data"

    static void main(String[] args) {
        staticFileLocation("/static")
        post '/api/encrypted', {
            req, res ->
                try {
                    if(isMultipart(req)){
                        req.attribute(MULTIPART_CONFIG_ATTRIBUTE, new MultipartConfigElement("/temp"))
                        encrypt(multipartAsString(req, SECRET_PARAM), multipartAsString(req, FILE_PARAM))
                    }else{
                        encrypt(req.queryParams(SECRET_PARAM), req.queryParams(PASSWORD_PARAM))
                    }
                } catch (Exception e) {
                    res.status(400)
                    return e.getMessage()
                }
        }

        post '/api/key', {
            req, res ->
                try {
                    generate(KeySize.valueOf(req.queryParams(KEY_SIZE)))
                } catch (Exception e) {
                    res.status(400)
                    return e.getMessage()
                }
        }

    }

    static multipartAsString(req, name){
        IOUtils.toString(req.raw().getPart(name).getInputStream() as InputStream)
    }

    static isMultipart(req){
        return req.contentType().contains(MULTIPART_CONTENT_TYPE)
    }
}