//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');
var driver = new Studio.Driver({
  initialize: function() {
    app.get('/user/:username', function(req, res) {
      driver.send(req, res).then(function(message) {
        res.send(message);
      }).catch(function(message) {
        res.send('Sorry, try again later => ' + message);
      });
    });
  },
  parser: function(req, res) {
    return {
      sender: null,
      receiver: 'helloActorFiltered',
      /* Now we are reading the username param and
      delivering to the actor as body*/
      body: req.params.username,
      headers: null
    };
  }
});