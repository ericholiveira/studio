var Studio = require('../../compiled/core/studio');

var bufferedActor = Studio.Actor({
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
  return stream.doAction(function(message) {
    /* Unfortunately when dealing directly with stream you need to use the
     raw object, so if you use buffer and don't call message.callback
     (using node standards for callback) the driver who sends the message will
     never fail the promise.
     So here, we call message.callback with the success string as second parameter
    */
    message.callback(null, 'Enqueued');
  }).bufferWithCount(5);
});