package com.splunk.splunkjenkins;

import hudson.model.AbstractBuild;
import hudson.model.FreeStyleProject;
import org.junit.Test;
import org.jvnet.hudson.test.recipes.LocalData;

import java.util.UUID;

import static com.splunk.splunkjenkins.SplunkConfigUtil.verifySplunkSearchResult;

public class CoverageMetricTest extends BaseTest {
    @LocalData
    @Test
    public void getCoberturaReport() throws Exception {
        String jobName = "Cobertura";
        getCoverageReport(jobName, 50);
    }

    @LocalData
    @Test
    public void getCloverReport() throws Exception {
        String jobName = "Clover";
        getCoverageReport(jobName, 50);
    }

    @LocalData
    @Test
    public void getJaCoCoReport() throws Exception {
        String jobName = "JaCoCo";
        getCoverageReport(jobName, 50);
    }

    public void getCoverageReport(String jobName, int methodPercentage) throws Exception {
        FreeStyleProject project = (FreeStyleProject) j.getInstance().getItem(jobName);
        String newName = UUID.randomUUID().toString();
        project.renameTo(newName);
        long startTime = System.currentTimeMillis();
        AbstractBuild build = project.scheduleBuild2(0).get();
        //verify coverage summary
        String query = "event_tag=job_event build_url=" + build.getUrl() + " \"coverage.methods\" >= " + methodPercentage;
        verifySplunkSearchResult(query, startTime, 1);
        //verify details
        query = "source=\"unit_test/coverage\" build_url=" + build.getUrl() + "|"
                + "rename \"coverage{}.methods_percentage\" as methods |mvexpand methods " +
                "|search methods>=" + methodPercentage;
        verifySplunkSearchResult(query, startTime, 1);
        //check total and covered number
        query = "splunk_server=local index=plugin_sandbox build_url=" + build.getUrl() +
                " source=\"unit_test/coverage\" \"com.mycompany\"\n" +
                "|spath output=coverage_json path=coverage{}|mvexpand coverage_json\n" +
                "|spath input=coverage_json|where name=\"com.mycompany\" and methods_total>methods_covered|table methods*";
        verifySplunkSearchResult(query, startTime, 1);
    }
}