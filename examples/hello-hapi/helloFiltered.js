//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var server = require('./server');
var driver = new Studio.Driver({
  initialize: function() {
    server.route({
      method: 'GET',
      path: '/user/{username}',
      handler: function(request, reply) {
        driver.send(request, reply).then(function(message) {
          reply(message);
        }).catch(function(message) {
          reply('Sorry, try again later => ' + message);
        });
      }
    });
  },
  parser: function(req, res) {
    return {
      sender: 'hapiDriver',
      receiver: 'helloActorFiltered',
      body: req.params.username,
      headers: null
    };
  }
});