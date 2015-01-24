//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');
var driver = new Studio.Driver({
  initialize: function () {
    app.get('/user/:username', function (req, res) {
      driver.send(req, res).then(function (message) {
        res.send(message);
      }).catch(function(message){
        res.send('Sorry, try again later => '+ message);
      });
    });
  },
  parser: function (req, res) {
    return {
      sender: null,
      receiver: 'helloActorFiltered',
      /* Now we are reading the username param and
      delivering to the actor as body*/
      body: req.params.username,
      headers: null
    };
  }
});
var userActor = new Studio.Actor({
  id: 'helloActorFiltered',
  process: function (body, headers, sender, receiver) {
    console.log('Received message to actor = ' + userActor.id);
    return 'Hello '+body;
  }
});
/* Let's say you have a rule where the username needs to start with lower case 'e'
   or the username is rejected. You could implement this logic on userActor 'process'
   function, but a better approach would be to keep your filter logic away from
   your business logic code. So all actors have the 'addTransformation' method,
   this method receives a function which receives the current actor message stream
   you can then use any baconjs transformation on this stream and return the
   transformed stream.
   With baconjs you can filter, map, buffer, reduce and apply a lot of different
   transformations on the actor stream, check the project baconjs project page
   on github for more information.
*/
//Here we apply a filter transformation
userActor.addTransformation(function(stream){
  return stream.filter(function(message){
    //We're going to accept only username starting with lower case 'e'
    var filterResult = (message.body.charAt(0)==='e');
    if(!filterResult){
      /* Unfortunately when dealing directly with stream you need to use the
       raw object, so if you use filter and don't call message.callback
       (using node standards for callback) the driver who sends the message will
       never fail the promise.
       So here, we call message.callback with the error string as first parameter
      */
      message.callback('This resource is only available for username starting with e');
    }
    return filterResult;
  });
});
