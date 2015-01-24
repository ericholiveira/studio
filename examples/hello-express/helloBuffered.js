//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');
var driver = new Studio.Driver({
  initialize: function () {
    app.get('/buffer', function (req, res) {
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
      receiver: 'helloActorBuffered',
      body: null,
      headers: null
    };
  }
});
var bufferedActor = new Studio.Actor({
  id: 'helloActorBuffered',
  process: function (body, headers, sender, receiver) {
    /*On this example you have to request five times the http://localhost:3000/buffer
     and only after that the 5 messages are going to be processed one by one in a row
     Which means, no console log before the 5 request, and then 5 logs in a row
    */
    console.log('Received message to actor = ' + bufferedActor.id);
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
//Here we apply a buffer transformation
bufferedActor.addTransformation(function(stream){
  return stream.bufferWithCount(5);
});
