//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');

var helloActorException = Studio.ref('helloActorException');

app.get('/exception', function(req, res) {
  helloActorException().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});