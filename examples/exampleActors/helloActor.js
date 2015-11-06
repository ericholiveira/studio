var Studio = require('../../compiled/core/studio');

var hello = Studio.Actor({
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