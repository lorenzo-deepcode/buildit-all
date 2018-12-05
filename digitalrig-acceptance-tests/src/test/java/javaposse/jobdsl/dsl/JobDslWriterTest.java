package javaposse.jobdsl.dsl;

import org.junit.Test;

import static java.util.Collections.emptyMap;
import static junit.framework.TestCase.assertTrue;

public class JobDslWriterTest {

    @Test
    public void testWriteJobXml() {

        JobDslWriter jobDslWriter = new JobDslWriter();
        assertTrue(jobDslWriter.writeJobXml("job('test') { steps { shell('echo YAY') } }", emptyMap())
                .contains("<command>echo YAY</command>"));

    }


    @Test(expected = IllegalStateException.class)
    public void testWriteJobXml_no_job_def() {

        JobDslWriter jobDslWriter = new JobDslWriter();
        jobDslWriter.writeJobXml("", emptyMap());

    }

    @Test(expected = IllegalStateException.class)
    public void testWriteJobXml_more_than_one_job_def() {

        JobDslWriter jobDslWriter = new JobDslWriter();
        jobDslWriter.writeJobXml("job('1'); job('2')", emptyMap());

    }

}