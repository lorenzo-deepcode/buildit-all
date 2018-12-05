package com.wiprodigital.confluence.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.util.List;

@JsonDeserialize(builder = Content.Builder.class)
public class Content {

    private final String id;
    private final Version version;
    private final String type;
    private final String title;
    private final Space space;
    private final Body body;
    private final List<Content> ancestors;

    private Content(
            String id, Version version, String type, String title, Space space, Body body, List<Content> ancestors) {
        this.id = id;
        this.version = version;
        this.type = type;
        this.title = title;
        this.space = space;
        this.body = body;
        this.ancestors = ancestors;
    }

    public String getId() {
        return id;
    }

    public Version getVersion() {
        return version;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public Space getSpace() {
        return space;
    }

    public Body getBody() {
        return body;
    }

    public List<Content> getAncestors() {
        return ancestors;
    }

    @Override
    public String toString() {
        return "Content{" +
                "id='" + id + '\'' +
                ", version=" + version +
                ", type='" + type + '\'' +
                ", title='" + title + '\'' +
                ", space=" + space +
                ", body=" + body +
                ", ancestors=" + ancestors +
                '}';
    }

    public static class Builder {

        private String id;
        private Version version;
        private String type;
        private String title;
        private Space space;
        private Body body;
        private List<Content> ancestors;

        public Content build() {
            return new Content(id, version, type, title, space, body, ancestors);
        }

        public Builder withId(String id) {
            this.id = id;
            return this;
        }

        public Builder withVersion(Version version) {
            this.version = version;
            return this;
        }

        public Builder withType(String type) {
            this.type = type;
            return this;
        }

        public Builder withTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder withSpace(Space space) {
            this.space = space;
            return this;
        }

        public Builder withBody(Body body) {
            this.body = body;
            return this;
        }

        public Builder withAncestors(List<Content> ancestors) {
            this.ancestors = ancestors;
            return this;
        }
    }

}
