var Studio = require('../../compiled/core/studio'); //Studio namespace
var server = require('./server');
var driver = new Studio.Driver({
  /* Actors and drivers may define an 'initialize' function which is going to
  be called on object construction
  */
  initialize: function() {
    /* On initialization we make the driver listen for request on a route
     */
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        driver.send(request, reply).then(function(message) {
          reply(message);
        }).catch(function(message) {
          reply('Sorry, try again later => ' + message);
        });
      }
    });
  },
  parser: function(req, res) {
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