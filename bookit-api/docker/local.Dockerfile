from openjdk:8-jdk-alpine

COPY . /usr/src/myapp
WORKDIR /usr/src/myapp

EXPOSE 8080

RUN ./gradlew build
