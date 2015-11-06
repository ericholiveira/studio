//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');

var helloActorDelayed = Studio.ref('helloActorDelayed');

app.get('/delay', function(req, res) {
  helloActorDelayed().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});