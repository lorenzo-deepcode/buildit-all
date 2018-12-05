var express = require('express');

module.exports = function server(folder) {
  var app = express();

  app.use(express.static(folder, { etag: true }));
  app.enable('trust proxy');

  return app;
};
