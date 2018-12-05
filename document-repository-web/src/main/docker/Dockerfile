FROM openjdk:8-jre-alpine

ENV JVM_OPTIONS ""
ENV WORKDIR_PATH /
ENV LOOKUP_PATH .
ENV JAR_FILENAME app.jar

ADD $LOOKUP_PATH/$JAR_FILENAME $WORKDIR_PATH

RUN apk add --update bash && rm -rf /var/cache/apk/*

EXPOSE 8080

ENTRYPOINT ["/bin/bash", "-c", "java $JVM_OPTIONS -jar $JAR_FILENAME"]
