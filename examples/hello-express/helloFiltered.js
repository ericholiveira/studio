//Getting started comments on hello.js file
var Studio = require('../../src/studio');
var app = require('./app');

var filteredService = Studio('filteredService');

app.get('/user/:username', function(req, res) {
  filteredService(req.params.username).then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});
