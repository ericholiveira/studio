var Studio = require('../../compiled/core/studio');


var chainActor2 = new Studio.Actor({
  id: 'chainActor2',
  process: function(body, headers, sender, receiver) {
    console.log('Received message to actor = ' + chainActor2.id);
    return body + 'actor2';
  }
});