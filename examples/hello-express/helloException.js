//Getting started comments on hello.js file
var Studio = require('../../src/studio');
var app = require('./app');

var errorService = Studio('errorService');

app.get('/exception', function(req, res) {
  errorService().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});