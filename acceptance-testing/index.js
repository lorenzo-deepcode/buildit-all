var app = require('./serve')(__dirname + '/build')
  , port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('%d listening on port %d', process.pid, port);
});