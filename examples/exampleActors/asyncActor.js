var Studio = require('../../compiled/core/studio');
var delayed = new Studio.Actor({
  id: 'helloActorDelayed',
  process: function(body, headers, sender, receiver) {
    //Now we're going to return a promise
    return new Studio.Promise(function(resolve, reject) {
      console.log('Received message to actor = ' + delayed.id);
      setTimeout(function() {
        //Wait 5 senconds before resolve the promise
        resolve('Hello World Delayed!!!');
      }, 5000);
    });
  }
});