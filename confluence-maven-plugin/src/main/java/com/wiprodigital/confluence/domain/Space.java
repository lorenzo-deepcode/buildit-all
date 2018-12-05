package com.wiprodigital.confluence.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(builder = Space.Builder.class)
public class Space {

    private final String key;

    private Space(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    @Override
    public String toString() {
        return "Space{" +
                "key='" + key + '\'' +
                '}';
    }

    public static class Builder {

        private String key;

        public Space build() {
            return new Space(key);
        }

        public Builder withKey(String key) {
            this.key = key;
            return this;
        }
    }

}
