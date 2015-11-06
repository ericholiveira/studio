//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var server = require('./server');

var helloActorException = Studio.ref('helloActorException');

server.route({
  method: 'GET',
  path: '/exception',
  handler: function(request, reply) {
    helloActorException().then(function(message) {
      reply(message);
    }).catch(function(message) {
      reply('Sorry, try again later => ' + message);
    });
  }
});
