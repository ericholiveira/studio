var Studio = require('../../src/studio'); //Studio namespace
var app = require('./app');

//Gets reference to helloService
var helloService = Studio('helloService');
//If you pass a String to Studio function it returns a reference for that service

app.get('/', function(req, res) {
  /* When this route is requested we send the message to the responsible
   service using the 'helloService' function, all references returns a promise
   when the promise is fulfilled the 'then' method is executed, if it is
   rejected the 'catch' method is executed
   */
  helloService().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});