//Getting started comments on hello.js file
var Studio = require('../../src/studio');
var app = require('./app');

var chainService1 = Studio('chainService1');

app.get('/chain', function(req, res) {
  chainService1().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});
