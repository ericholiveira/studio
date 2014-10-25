(function() {
  var Actor, logActor, router;

  require('source-map-support').install();

  Actor = require('./core/actor');

  router = require('./core/router');

  logActor = new Actor({
    id: 'log',
    process: function(message, sender) {
      return console.log(message);
    }
  });


  /*
  logActor.addTransformation((stream)->stream.bufferWithCount(2).map((messages)->
    {sender,receiver,callback} = messages[0]
    acc = {sender,receiver,callback}
    acc.body = []
    acc.body.push(message.body) for message in messages
    acc))
   */

  logActor.send('log', {
    message: 'Hello World!!!'
  }).then(function() {
    return console.log('FIM');
  });

  console.log('TESTE');

  logActor.send('broadcast', {
    message: 'broadcast'
  });

  logActor.send('log', {
    message: 'Hello World2'
  });

  logActor.send('log', {
    message: 'Hello World2'
  });

}).call(this);

//# sourceMappingURL=maps\teste.js.map
