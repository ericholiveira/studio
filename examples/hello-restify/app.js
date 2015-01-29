var restify = require('restify');
var server = restify.createServer({
  name: 'hello',
  version: '1.0.0'
});

server.listen(3000, function() {
  console.log('Hello World application running on http://localhost:3000');
});

module.exports = server;