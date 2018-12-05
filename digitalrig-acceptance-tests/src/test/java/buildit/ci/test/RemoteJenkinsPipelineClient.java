package buildit.ci.test;

import com.google.common.collect.ImmutableMap;
import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.*;
import javaposse.jobdsl.dsl.JobDslWriter;

import java.io.IOException;
import java.io.PrintStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.Objects;

import static com.google.common.base.Preconditions.checkState;
import static java.lang.Thread.sleep;

public class RemoteJenkinsPipelineClient implements PipelineClient {

    private static final String GENERATED_TEST_JOB = "generated test job";
    public static final String HEALTHCHECK = "healthcheck";
    public static final int JOB_POLL_TIMEOUT = 200;
    public static final String PIPELINE_SCRIPT = "__PIPELINE_SCRIPT";
    private final String jenkinsUrl;
    private final PrintStream out;

    public RemoteJenkinsPipelineClient(final String jenkinsUrl, final PrintStream out) {
        this.jenkinsUrl = Objects.requireNonNull(jenkinsUrl, "Jenkins URL must be provided");
        this.out = out;
    }

    @Override
    public BuildWithDetails executePipeline(final String scriptText, final Map<String, ?> params) {

        URI serverUri = null;
        try {
            serverUri = new URI(jenkinsUrl);
        } catch (final URISyntaxException e) {
            throw new RuntimeException("Jenkins URL is not valid", e);
        }

        final JenkinsServer jenkinsServer = new JenkinsServer(serverUri);
        final Map<String, ?> bindings = ImmutableMap.<String, Object>builder()
                .putAll(params)
                .put(PIPELINE_SCRIPT, scriptText)
                .build();

        final String jobXml = new JobDslWriter().writeJobXml("pipelineJob('__generated') {\n" +
                "    definition {\n" +
                "        cps {\n" +
                "            script(" + PIPELINE_SCRIPT + ")\n" +
                "            sandbox()\n" +
                "        }\n" +
                "    }\n" +
                "}", bindings);

        final FolderJob folder = getOrCreateFolder(jenkinsServer, HEALTHCHECK);

        final String jobName = GENERATED_TEST_JOB;
        final JobWithDetails newJob = createOrUpdateJob(jenkinsServer, folder, jobName, jobXml);

        return buildJobSync(jenkinsServer, folder, jobName, newJob);
    }

    private BuildWithDetails buildJobSync(final JenkinsServer jenkinsServer, final FolderJob folder, final String jobName, final JobWithDetails newJob) {
        final ExtractHeader location;
        try {
            location = newJob.getClient().post(newJob.getUrl() + "build", null, ExtractHeader.class);
            final QueueReference build = new QueueReference(location.getLocation());
            //QueueReference build = job.build(Collections.singletonMap("PARAM", "hah"), false);
            QueueItem queueItem = jenkinsServer.getQueueItem(build);
            while (queueItem.getExecutable() == null) {
                sleep(JOB_POLL_TIMEOUT);
                queueItem = jenkinsServer.getQueueItem(build);
            }
            out.println("Building");
            final JobWithDetails job = jenkinsServer.getJob(folder, jobName);
            final Build lastBuild = job.getLastBuild();
            boolean isBuilding = lastBuild.details().isBuilding();
            while (isBuilding) {
                out.println("Is building #" + lastBuild.getNumber());
                Thread.sleep(200);
                isBuilding = lastBuild.details().isBuilding();
            }
            return lastBuild.details();
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Failed to build job " + jobName + " in the folder " + folder.getName());
        }
    }

    private JobWithDetails createOrUpdateJob(final JenkinsServer jenkinsServer, final FolderJob folder,
                                             final String jobName, final String jobXml) {
        final JobWithDetails job;
        try {
            //FIXME: we could update insted of delete / create
            job = jenkinsServer.getJob(folder, jobName);
            if (job != null) {
                jenkinsServer.deleteJob(folder, jobName);
            }
            jenkinsServer.createJob(folder, jobName, jobXml, true);
            return jenkinsServer.getJob(folder, jobName);
        } catch (final IOException e) {
            throw new RuntimeException("Failed to create test job", e);
        }
    }

    private FolderJob getOrCreateFolder(final JenkinsServer jenkinsServer, final String folderName) {
        JobWithDetails healthcheckJob = null;
        try {
            healthcheckJob = jenkinsServer.getJob(folderName);
            if (healthcheckJob == null) {
                jenkinsServer.createFolder(folderName);
                healthcheckJob = jenkinsServer.getJob(folderName);
            }
            final FolderJob folderJob = jenkinsServer.getFolderJob(healthcheckJob).get();
            checkState(folderJob.isFolder());
            return folderJob;
        } catch (final IOException e) {
            throw new RuntimeException("Failed to create Jenkins folder", e);
        }
    }
}

