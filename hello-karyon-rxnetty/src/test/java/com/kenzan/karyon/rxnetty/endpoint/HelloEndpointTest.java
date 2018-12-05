/**
 * Copyright 2015 Kenzan, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.kenzan.karyon.rxnetty.endpoint;

import io.netty.buffer.ByteBuf;
import io.reactivex.netty.protocol.http.server.HttpServerRequest;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import rx.Observable;

@RunWith(MockitoJUnitRunner.class)
public class HelloEndpointTest {

    @Mock
    private HttpServerRequest<ByteBuf> request;

    @Test
    public void helloTest() {
        HelloEndpoint helloEndpoint = new HelloEndpoint();

        Observable<String> hello = helloEndpoint.getHello();

        Assert.assertEquals("Hello", hello.toBlocking().first());
    }

    @Test
    public void helloNameTest() {
        HelloEndpoint helloEndpoint = new HelloEndpoint();

        Mockito.when(request.getUri()).thenReturn("/hello/name");

        Observable<String> hello = helloEndpoint.getHelloName(request);

        Assert.assertEquals("Hello name", hello.toBlocking().first());
    }
}
