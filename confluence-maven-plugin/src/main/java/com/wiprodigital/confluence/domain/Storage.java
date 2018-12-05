package com.wiprodigital.confluence.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(builder = Storage.Builder.class)
public class Storage {

    private final String representation;
    private final String value;

    private Storage(String representation, String value) {
        this.representation = representation;
        this.value = value;
    }

    public String getRepresentation() {
        return representation;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "Storage{" +
                "representation='" + representation + '\'' +
                ", value='" + value + '\'' +
                '}';
    }

    public static class Builder {

        private String representation;
        private String value;

        public Storage build() {
            return new Storage(representation, value);
        }

        public Builder withRepresentation(String representation) {
            this.representation = representation;
            return this;
        }

        public Builder withValue(String value) {
            this.value = value;
            return this;
        }
    }
}