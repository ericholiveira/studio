//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var server = require('./server');

var helloActorBuffered = Studio.ref('helloActorBuffered');


server.route({
  method: 'GET',
  path: '/buffer',
  handler: function(request, reply) {
    helloActorBuffered().then(function(message) {
      reply(message);
    }).catch(function(message) {
      reply('Sorry, try again later => ' + message);
    });
  }
});