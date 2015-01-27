var Studio = require('../../compiled/core/studio');

var hello = new Studio.Actor({
  id: 'helloActor', //UNIQUE Actor identification is required.
  process: function(body, headers, sender, receiver) {
    /* When a message arrives, the process function is going to receive a copy
    of that message, the process function may return any js object, nothing
    or a promise
    */
    console.log('Received message to actor = ' + hello.id);
    return 'Hello World!!!';
  }
});

var exc = new Studio.Actor({
  id: 'helloActorException',
  process: function(body, headers, sender, receiver) {
    /*Throw an error, the 'catch' method of the promise returned to the driver
    is going to be executed
    */
    console.log('Received message to actor = ' + exc.id);
    throw new Error('Some error occurred!!!');
  }
});

var delayed = new Studio.Actor({
  id: 'helloActorDelayed',
  process: function(body, headers, sender, receiver) {
    //Now we're going to return a promise
    var defer = Studio.Q.defer();
    console.log('Received message to actor = ' + delayed.id);
    setTimeout(function() {
      //Wait 5 senconds before resolve the promise
      defer.resolve('Hello World Delayed!!!');
    }, 5000);
    return defer.promise;
  }
});

var userActor = new Studio.Actor({
  id: 'helloActorFiltered',
  process: function(body, headers, sender, receiver) {
    console.log('Received message to actor = ' + userActor.id);
    return 'Hello ' + body;
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
userActor.addTransformation(function(stream) {
  return stream.filter(function(message) {
    //We're going to accept only username starting with lower case 'e'
    var filterResult = (message.body.charAt(0) === 'e');
    if (!filterResult) {
      /* Unfortunately when dealing directly with stream you need to use the
       raw object, so if you use filter and don't call message.callback
       (using node standards for callback) the driver who sends the message will
       never fail the promise.
       So here, we call message.callback with the error string as first parameter
      */
      message.callback(
        'This resource is only available for username starting with e'
      );
    }
    return filterResult;
  });
});

var bufferedActor = new Studio.Actor({
  id: 'helloActorBuffered',
  process: function(body, headers, sender, receiver) {
    /*On this example you have to request five times the http://localhost:3000/buffer
     and only after that the 5 messages are going to be processed one by one in a row
     Which means, no console log before the 5 request, and then 5 logs in a row
    */
    console.log('Received message to actor = ' + bufferedActor.id);
  }
});
//Here we apply a buffer transformation
bufferedActor.addTransformation(function(stream) {
  return stream.bufferWithCount(5);
});