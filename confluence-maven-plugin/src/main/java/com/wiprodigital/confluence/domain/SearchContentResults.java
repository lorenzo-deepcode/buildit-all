package com.wiprodigital.confluence.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.util.List;

@JsonDeserialize(builder = SearchContentResults.Builder.class)
public class SearchContentResults {

    private final List<Content> results;

    private SearchContentResults(List<Content> results) {
        this.results = results;
    }

    public List<Content> getResults() {
        return results;
    }

    @Override
    public String toString() {
        return "SearchContentResults{" +
                "results=" + results +
                '}';
    }

    public static class Builder {

        private List<Content> results;

        public SearchContentResults build() {
            return new SearchContentResults(results);
        }

        public Builder withResults(List<Content> results) {
            this.results = results;
            return this;
        }
    }
}
