(function() {
  var Actor, router;

  router = require('./router');

  Actor = (function() {
    function Actor(options) {
      this.id = options.id, this.process = options.process, this.stream = options.stream;
      router.registerActor(this);
    }

    Actor.prototype.sendMessage = function(receiver, message) {
      return router.sendMessage(this.id, receiver, message);
    };

    return Actor;

  })();

  module.exports = Actor;

}).call(this);

//# sourceMappingURL=..\maps\actor.js.map
