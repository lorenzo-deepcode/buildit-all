package com.wiprodigital;

import com.wiprodigital.confluence.ConfluenceApi;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.codehaus.plexus.util.Base64;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import java.io.IOException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

public class ComponentFactory {

    public static ConfluenceApi confluenceApi(
            String username, String password, URL apiBaseUrl, long readTimeoutMs, long connectionTimeoutMs) {
        final ComponentFactory.BasicAuthInterceptor basicAuthInterceptor =
                ComponentFactory.basicAuthInterceptor(username, password);

        final Retrofit retrofit = ComponentFactory.retrofit(
                ComponentFactory.okHttpClient(basicAuthInterceptor, readTimeoutMs, connectionTimeoutMs),
                ComponentFactory.objectMapper(),
                apiBaseUrl.toString());

        return retrofit.create(ConfluenceApi.class);
    }

    public static Retrofit retrofit(
            OkHttpClient okHttpClient, ObjectMapper objectMapper, String apiBaseUrl) {
        return new Retrofit.Builder()
                .baseUrl(apiBaseUrl)
                .client(okHttpClient)
                .addConverterFactory(JacksonConverterFactory.create(objectMapper))
                .build();
    }

    public static ObjectMapper objectMapper() {
        return new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public static OkHttpClient okHttpClient(
            BasicAuthInterceptor basicAuthInterceptor, long readTimeoutMs, long connectionTimeoutMs) {
        return new OkHttpClient.Builder()
                .addNetworkInterceptor(basicAuthInterceptor)
                .readTimeout(readTimeoutMs, TimeUnit.MILLISECONDS)
                .connectTimeout(connectionTimeoutMs, TimeUnit.MILLISECONDS)
                .build();
    }

    public static BasicAuthInterceptor basicAuthInterceptor(String username, String password) {
        return new BasicAuthInterceptor(username, password);
    }

    public static class BasicAuthInterceptor implements Interceptor {

        private final String username;
        private final String password;

        public BasicAuthInterceptor(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public Response intercept(Chain chain) throws IOException {
            final Request newRequest = chain.request().newBuilder()
                    .addHeader("Authorization", "Basic " + encodeCredentials(username, password))
                    .build();

            return chain.proceed(newRequest);
        }

        private static String encodeCredentials(String username, String password) {
            final String credentials = String.format("%s:%s", username, password);
            return new String(Base64.encodeBase64(credentials.getBytes()));
        }
    }

}
