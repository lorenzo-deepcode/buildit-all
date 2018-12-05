package com.buildit.parser;

import java.net.URLDecoder;

class ResourcePath {

    public static String resourcePath(String path, String basePath) throws Exception {
        String fullPath = "" + "/" + path;
        if(basePath.length()==0){
            fullPath = path;
        }
        String url = new ResourcePath().getClass().getClassLoader().getResource(fullPath).toString().replace("file:", "");
        String result = URLDecoder.decode(url, "UTF8");
        System.out.println("Full path of " + path + " is " + result);
        return result == null || result.endsWith("null") ? null : result;
    }
}