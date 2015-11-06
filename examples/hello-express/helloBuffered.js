//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');

var helloActorBuffered = Studio.ref('helloActorBuffered');

app.get('/buffer', function(req, res) {
  helloActorBuffered().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});
