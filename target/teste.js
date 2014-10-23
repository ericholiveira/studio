(function() {
  var Actor, logActor, router;

  require('source-map-support').install();

  Actor = require('./core/actor');

  router = require('./core/router');

  router.registerFilter(/log/g, function(message) {
    console.log('FILTER!!!');
    if (message.body.message === 'Hello World!!!') {
      return false;
    } else {
      message.body = 'kfkjkdfj';
      return message;
    }
  });

  logActor = new Actor({
    id: 'log',
    process: function(message, sender) {
      return console.log(message);
    }
  });

  logActor.sendMessage('log', {
    message: 'Hello World!!!'
  });

  logActor.sendMessage('broadcast', {
    message: 'broadcast'
  });

  logActor.sendMessage('log', {
    message: 'Hello World2!!!'
  });

  logActor.sendMessage('log', {
    message: 'Hello World2!!!'
  });

}).call(this);

//# sourceMappingURL=maps/teste.js.map
