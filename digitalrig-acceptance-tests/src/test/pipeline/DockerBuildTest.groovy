node {

    writeFile(file: "server.js", text: """
var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World\\n");
});
server.listen(6543);""")
    writeFile(file: "Dockerfile", text: """
FROM node:6
WORKDIR /usr/src/app
COPY server.js /usr/src/app/server.js

EXPOSE 3000
CMD [ "node", "server.js" ]""")

    env.TIMESTAMP = new Date().time
    docker.build("docker_test:$TIMESTAMP", '.')
}
