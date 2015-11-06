var Studio = require('../../compiled/core/studio'); //Studio namespace
var app = require('./app');

//Gets reference to helloActor
var sayHello = Studio.ref('helloActor');

app.get('/', function(req, res) {
  /* When this route is requested we send the message to the responsible
   actor using the 'sayHello' function, all references returns a promise
   when the promise is fulfilled the 'then' method is executed, if it is
   rejected the 'catch' method is executed
   */
  sayHello().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});