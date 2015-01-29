//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');
var driver = new Studio.Driver({
  initialize: function() {
    app.get('/delay', function(req, res) {
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
      receiver: 'helloActorDelayed',
      body: null,
      headers: null
    };
  }
});