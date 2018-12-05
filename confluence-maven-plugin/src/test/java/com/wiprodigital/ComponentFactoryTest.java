package com.wiprodigital;

import okhttp3.OkHttpClient;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.instanceOf;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;

public class ComponentFactoryTest {

    @Test
    public void httpClientShouldBeConfiguredWith_timeoutsAndBasicAuthInterceptor() {
        final int readTimeoutMs = 1000;
        final int connectionTimeoutMs = 1000;

        final OkHttpClient okHttpClient = ComponentFactory.okHttpClient(
                ComponentFactory.basicAuthInterceptor("user", "pass"), readTimeoutMs, connectionTimeoutMs);

        assertThat(okHttpClient.readTimeoutMillis(), equalTo(readTimeoutMs));
        assertThat(okHttpClient.connectTimeoutMillis(), equalTo(connectionTimeoutMs));
        assertThat(okHttpClient.networkInterceptors().isEmpty(), is(false));
        assertThat(okHttpClient.networkInterceptors().get(0), instanceOf(ComponentFactory.BasicAuthInterceptor.class));
    }

}