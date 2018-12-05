package com.splunk.splunkjenkins.model;

import com.google.common.collect.Lists;
import hudson.ExtensionList;
import hudson.ExtensionPoint;
import hudson.model.HealthReportingAction;
import hudson.model.Run;
import org.jvnet.tiger_types.Types;

import javax.annotation.Nonnull;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

/**
 * Extracts  Coverage metric
 *
 * @param <M> Coverage Action
 */
public abstract class CoverageMetricsAdapter<M extends HealthReportingAction> implements ExtensionPoint {
    public final Class<M> targetType;
    static final String PERCENTAGE_SUFFIX = "_percentage";
    static final String TOTAL_SUFFIX = "_total";
    static final String COVERED_SUFFIX = "_covered";


    public CoverageMetricsAdapter() {
        Type type = Types.getBaseClass(getClass(), CoverageMetricsAdapter.class);
        if (type instanceof ParameterizedType)
            targetType = Types.erasure(Types.getTypeArgument(type, 0));
        else
            throw new IllegalStateException(getClass() + " uses the raw type for extending CoverageMetricsAdapter");

    }

    public M getAction(Run run) {
        return run.getAction(targetType);
    }

    public boolean isApplicable(Run build) {
        return getAction(build) != null;
    }

    @Nonnull
    public static Map<Metric, Integer> getMetrics(Run build) {
        List<CoverageMetricsAdapter> adapters = ExtensionList.lookup(CoverageMetricsAdapter.class);
        for (CoverageMetricsAdapter adapter : adapters) {
            if (adapter.isApplicable(build)) {
                return adapter.getMetrics(adapter.getAction(build));
            }
        }
        return Collections.EMPTY_MAP;
    }

    /**
     * @param coverageAction coverage action
     * @return coverage metrics, key is metric, value is percentage
     */
    public abstract Map<Metric, Integer> getMetrics(M coverageAction);

    /**
     * @param coverageAction coverage action
     * @return coverage report, key is filename, value is percentage
     */
    public abstract List<CoverageDetail> getReport(M coverageAction);

    /**
     * @param build    Jenkins build
     * @param pageSize page size, <code>0</code> will disable pagination
     * @return coverage report with no more than <code>pageSize</code>
     */
    public static List<List<CoverageDetail>> getReport(Run build, int pageSize) {
        List<CoverageMetricsAdapter> adapters = ExtensionList.lookup(CoverageMetricsAdapter.class);
        List<CoverageDetail> reports = new ArrayList<>();
        for (CoverageMetricsAdapter adapter : adapters) {
            if (adapter.isApplicable(build)) {
                reports.addAll(adapter.getReport(adapter.getAction(build)));
            }
        }
        if (reports.isEmpty()) {
            return Collections.emptyList();
        }
        if (pageSize == 0 || reports.size() <= pageSize) {
            return Arrays.asList(reports);
        } else {
            return Lists.partition(reports, pageSize);
        }
    }

    public enum Metric {
        PACKAGE("packages"),
        FILE("files"),
        CLASS("classes"),
        METHOD("methods"),
        CONDITIONAL("conditionals"),
        STATEMENT("statements"),
        LINE("lines"),
        ELEMENT("elements"),
        //for Emma (JaCoCo plugin)
        COMPLEXITY("complexity"),
        BRANCH("branches"),
        INSTRUCTION("instructions");


        private String description;

        Metric(String description) {
            this.description = description;
        }

        public String toString() {
            return description;
        }

        /**
         * Clover and Cobertura use different metrics name, try to align them using nearest value
         *
         * @param name Metrics name
         * @return enum if defined, otherwise null
         */
        public static Metric getMetric(String name) {
            for (Metric metric : values()) {
                String metricsName = metric.name();
                if (metricsName.equals(name) || name.startsWith(metricsName)) {
                    return metric;
                }
            }
            return null;
        }
    }

    /**
     * used to trace which level coverage generated
     */
    public enum CoverageLevel {
        PROJECT, PACKAGE, CLASS, METHOD, FILE
    }

    public static class CoverageDetail {
        Map<String, Object> report = new HashMap<>();

        public CoverageDetail(String name) {
            report.put("name", name);
        }

        public CoverageDetail(String name, CoverageLevel level) {
            report.put("name", name);
            report.put("cov_level", level.toString().toLowerCase());
        }

        public Map<String, Object> getReport() {
            return report;
        }

        public void add(Metric metric, int value) {
            report.put(metric.toString(), value);
        }

        /**
         * @param metric metric name, such as classes, methods
         * @param value  percentage value
         */
        public void add(String metric, int value) {
            Metric reportMetric = Metric.getMetric(metric);
            if (reportMetric != null) {
                report.put(reportMetric.toString(), value);
            } else {
                report.put(metric, value);
            }
        }

        public void putAll(Map<Metric, Integer> subReport) {
            for (Metric metric : subReport.keySet()) {
                report.put(metric.toString(), subReport.get(metric));
            }
        }

    }
}
