var Studio = require('../../compiled/core/studio');

var exc = new Studio.Actor({
  id: 'helloActorException',
  process: function(body, headers, sender, receiver) {
    /*Throw an error, the 'catch' method of the promise returned to the driver
    is going to be executed
    */
    console.log('Received message to actor = ' + exc.id);
    throw new Error('Some error has occurred!!!');
  }
});