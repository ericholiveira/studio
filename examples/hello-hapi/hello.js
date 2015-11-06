var Studio = require('../../compiled/core/studio'); //Studio namespace
var server = require('./server');

var helloActor = Studio.ref('helloActor');


server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    helloActor().then(function(message) {
      reply(message);
    }).catch(function(message) {
      reply('Sorry, try again later => ' + message);
    });
  }
});
