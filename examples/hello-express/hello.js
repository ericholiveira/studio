var Studio = require('../../compiled/core/studio');//Studio namespace
var app = require('./app');
var driver = new Studio.Driver({
  /* Actors and drivers may define an 'initialize' function which is going to
  be called on object construction
  */
  initialize: function () {
    /* On initialization we make the driver listen for request on a route
    */
    app.get('/', function (req, res) {
      /* When this route is requested we send the message to the responsible
      actor using the 'send' function, this function is going to call the
      parser function of this router to discover the message content/headers
      and the receiver id. All 'send' functions on studio returns a promise
      when the promise is fulfilled the 'then' method is executed, if it is
      rejected the 'catch' method is executed
      */
      driver.send(req, res).then(function (message) {
        res.send(message);
      }).catch(function(message){
        res.send('Sorry, try again later => '+ message);
      });
    });
  },
  parser: function (req, res) {
    /* All drivers must define a 'parser' function which take the driver
    arguments and map to an object with sender,receiver,body and headers
    the parser function could also return a promise
    */
    return {
      sender: 'expressDriver',
      receiver: 'helloActor',
      body: null,
      headers: null
    };
  }
});
//Now we create the actor who is going to handle the response
var hello = new Studio.Actor({
  id: 'helloActor',//UNIQUE Actor identification is required.
  process: function (body, headers, sender, receiver) {
    /* When a message arrives, the process function is going to receive a copy
    of that message, the process function may return any js object, nothing
    or a promise
    */
    console.log('Received message to actor = ' + hello.id);
    return 'Hello World!!!';
  }
});
