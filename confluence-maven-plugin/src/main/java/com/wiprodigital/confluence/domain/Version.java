package com.wiprodigital.confluence.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(builder = Version.Builder.class)
public class Version {

    private final long number;

    private Version(long number) {
        this.number = number;
    }

    public long getNumber() {
        return number;
    }

    @Override
    public String toString() {
        return "Version{" +
                "number='" + number + '\'' +
                '}';
    }

    public static class Builder {

        private long number;

        public Version build() {
            return new Version(number);
        }

        public Builder withNumber(long number) {
            this.number = number;
            return this;
        }
    }

}
