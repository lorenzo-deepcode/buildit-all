package buildit.ci.test;

import com.offbytwo.jenkins.model.BuildWithDetails;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import static java.util.Collections.emptyMap;

public interface PipelineClient {

    BuildWithDetails executePipeline(String scriptText, Map<String, ?> params);

    default BuildWithDetails executePipeline(final Path pipeline, final Map<String, ?> params) {
        final String scriptText;
        try {
            scriptText = new String(Files.readAllBytes(pipeline));
        } catch (final IOException e) {
            throw new RuntimeException("Failed to read pipeline definition", e);
        }
        return executePipeline(scriptText, params);
    }

    default BuildWithDetails executePipeline(Path pipeline) {
        return executePipeline(pipeline, emptyMap());
    }
}
