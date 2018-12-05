package com.buildit.documents;

import com.amazonaws.services.lambda.runtime.events.S3Event;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import com.amazonaws.services.lambda.runtime.Context;


public class DocumentIndexerTest {

    private static S3Event s3event;

    @BeforeClass
    public static void createInput() throws Exception {
        //s3event = TestUtils.parse("s3-event.put.json", S3Event.class);
    }

    @Test
    @Ignore
    public void testLambdaFunctionHandler() {
        DocumentIndexer handler = new DocumentIndexer();
        Context ctx = createContext();
        Object output = handler.handleRequest(s3event, ctx);
        if (output != null) {
            System.out.println(output.toString());
        }
        Assert.assertEquals("sourcebucket", output);
    }

    private Context createContext() {
        TestContext ctx = new TestContext();

        // TODO: customize your context here if needed.
        ctx.setFunctionName("LambdaForm");

        return ctx;
    }
}
