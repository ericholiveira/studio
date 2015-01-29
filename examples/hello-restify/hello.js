var Studio = require('../../compiled/core/studio'); //Studio namespace
var app = require('./app');
var driver = new Studio.Driver({
  /* Actors and drivers may define an 'initialize' function which is going to
  be called on object construction
  */
  initialize: function() {
    /* On initialization we make the driver listen for request on a route
     */
    app.get('/', function(req, res) {
      /* When this route is requested we send the message to the responsible
      actor using the 'send' function, this function is going to call the
      parser function of this router to discover the message content/headers
      and the receiver id. All 'send' functions on studio returns a promise
      when the promise is fulfilled the 'then' method is executed, if it is
      rejected the 'catch' method is executed
      */
      driver.send(req, res).then(function(message) {
        res.send(message);
      }).catch(function(message) {
        res.send('Sorry, try again later => ' + message);
      });
    });
  },
  parser: function(req, res) {
    /* All drivers must define a 'parser' function which take the driver
    arguments and map to an object with sender,receiver,body and headers
    the parser function could also return a promise
    */
    return {
      sender: 'restifyDriver',
      receiver: 'helloActor',
      body: null,
      headers: null
    };
  }
});