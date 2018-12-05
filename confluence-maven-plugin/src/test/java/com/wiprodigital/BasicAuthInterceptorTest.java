package com.wiprodigital;

import okhttp3.*;
import org.junit.Test;

import java.io.IOException;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;

public class BasicAuthInterceptorTest {

    @Test
    public void basicAuthInterceptor_shouldIncludeProperlyEncodedAuthorizationHeader() throws IOException {
        final String username = "fake-username";
        final String password = "fake-password";
        final String expectedAuthorizationHeader = "Basic ZmFrZS11c2VybmFtZTpmYWtlLXBhc3N3b3Jk";

        final ComponentFactory.BasicAuthInterceptor basicAuthInterceptor = new ComponentFactory.BasicAuthInterceptor(username, password);
        final Response response = basicAuthInterceptor.intercept(new CopyRequestToResponse());

        assertThat(response.request().headers().size(), equalTo(1));
        assertThat(response.request().headers().get("Authorization"), equalTo(expectedAuthorizationHeader));
    }

    private static class CopyRequestToResponse implements Interceptor.Chain {

        public Request request() {
            return new Request.Builder().url("http://fake.url").build();
        }

        public Response proceed(Request request) throws IOException {
            return new Response.Builder()
                    .request(request)
                    .protocol(Protocol.HTTP_1_1)
                    .code(200)
                    .build();
        }

        public Connection connection() {
            return null;
        }
    }

}