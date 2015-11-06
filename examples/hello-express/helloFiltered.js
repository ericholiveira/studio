//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');

var helloActorFiltered = Studio.ref('helloActorFiltered');

app.get('/user/:username', function(req, res) {
  helloActorFiltered(req.params.username).then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});
