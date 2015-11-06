//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var server = require('./server');

var chainActor1 = Studio.ref('chainActor1');

server.route({
  method: 'GET',
  path: '/chain',
  handler: function(request, reply) {
    chainActor1().then(function(message) {
      reply(message);
    }).catch(function(message) {
      reply('Sorry, try again later => ' + message);
    });
  }
});
