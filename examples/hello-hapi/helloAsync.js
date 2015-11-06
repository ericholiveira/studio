//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var server = require('./server');

var helloActorDelayed = Studio.ref('helloActorDelayed');

server.route({
  method: 'GET',
  path: '/delay',
  handler: function(request, reply) {
    helloActorDelayed().then(function(message) {
      reply(message);
    }).catch(function(message) {
      reply('Sorry, try again later => ' + message);
    });
  }
});
