package javaposse.jobdsl.dsl;

import com.google.common.collect.Iterables;

import java.io.IOException;
import java.util.Map;

import static com.google.common.base.Preconditions.checkState;
import static com.google.common.base.Throwables.propagate;

public class JobDslWriter {

    public String writeJobXml(final String jobScript, final Map<String, ?> parameters) {
        final MemoryJobManagement management = new MemoryJobManagement();
        management.getParameters().putAll(parameters);
        GeneratedItems result = null;
        try {
            result = new DslScriptLoader(management).runScript(jobScript);
        } catch (IOException e) {
            propagate(e);
        }
        checkState(result.getJobs().size() == 1,
                "Exactly one job should be generated, but result is ${result}");
        final Map<String, String> savedConfigs = management.getSavedConfigs();
        checkState(savedConfigs.size() == 1);
        return Iterables.getOnlyElement(management.getSavedConfigs().values());
    }
}
