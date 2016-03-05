//Getting started comments on hello.js file
var Studio = require('../../src/studio');
var app = require('./app');

var asyncService = Studio('asyncService');

app.get('/delay', function(req, res) {
  asyncService().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});