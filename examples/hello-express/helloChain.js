//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');

var chainedMessage = Studio.ref('chainActor1');

app.get('/chain', function(req, res) {
  chainedMessage().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});
