var Studio = require('../../compiled/core/studio'); //Studio namespace
var app = require('./app');
var driver = new Studio.Driver({
  /* Actors and drivers may define an 'initialize' function which is going to
  be called on object construction
  */
  initialize: function() {
    /* On initialization we make the driver listen for request on a route
     */
    app.get('/', function*() {
      /* When this route is requested we send the message to the responsible
      actor using the 'send' function, this function is going to call the
      parser function of this router to discover the message content/headers
      and the receiver id. All 'send' functions on studio returns a promise,
      since we are using koa we can yield this promise and use try/catch
      block to handle the result
      */
      try{
        this.body = yield driver.send(this);
      }catch (err){
        this.body = 'Sorry, try again later => ' + err;
      }
    });
  },
  /* All drivers must define a 'parser' function which take the driver
  arguments and map to an object with sender,receiver,body and headers
  the parser function could also return a promise
  */
  parser: function(ctx) {
    return {
      sender: 'expressDriver',
      receiver: 'helloActor',
      body: null,
      headers: null
    };
  }
});
