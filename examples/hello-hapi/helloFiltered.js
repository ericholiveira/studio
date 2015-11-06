//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var server = require('./server');

var helloActorFiltered = Studio.ref('helloActorFiltered');

server.route({
  method: 'GET',
  path: '/user/{username}',
  handler: function(request, reply) {
    helloActorFiltered(request.params.username).then(function(message) {
      reply(message);
    }).catch(function(message) {
      reply('Sorry, try again later => ' + message);
    });
  }
});
