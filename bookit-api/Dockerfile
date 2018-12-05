# TODO figure out how to change to oracle JRE
# FROM frolvlad/alpine-oraclejdk8:slim
FROM openjdk:8-jre-alpine
RUN apk update && apk upgrade && \
  apk add --no-cache openssl ca-certificates

RUN wget https://github.com/Droplr/aws-env/raw/f6b72b9a61602f60b161590516dac2226e0cf197/bin/aws-env-linux-amd64 -O /bin/aws-env && \
  chmod +x /bin/aws-env

WORKDIR /usr/src/app
EXPOSE 8080
ADD build/libs/bookit-api*.jar bookit-api.jar
CMD eval $(aws-env) && java -jar bookit-api.jar
