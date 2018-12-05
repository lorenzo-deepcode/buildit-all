package com.wiprodigital.confluence.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonDeserialize(builder = Body.Builder.class)
public class Body {

    private final Storage storage;

    private Body(Storage storage) {
        this.storage = storage;
    }

    public Storage getStorage() {
        return storage;
    }

    @Override
    public String toString() {
        return "Body{" +
                "storage=" + storage +
                '}';
    }

    public static class Builder {

        private Storage storage;

        public Body build() {
            return new Body(storage);
        }

        public Builder withStorage(Storage storage) {
            this.storage = storage;
            return this;
        }
    }

}
