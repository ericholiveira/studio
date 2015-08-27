var Studio = require('../../compiled/core/studio');

/*
This is another way to instatiate an actor, this is the same as:

Studio.actorFactory({chainActor2:function (body, headers, sender, receiver) {
  console.log('Received message to actor = ' + this.id);
  return body + 'actor2';
}});

OR

var chainActor2 = new Studio.Actor({
  id: 'chainActor2',
  process:function(body, headers, sender, receiver) {
    console.log('Received message to actor = ' + this.id);
    return body + 'actor2';
  }
});
*/
Studio.actorFactory(function chainActor2(body, headers, sender, receiver) {
  console.log('Received message to actor = ' + this.id);
  return body + 'actor2';
});