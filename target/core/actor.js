(function() {
  var Actor, router,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  router = require('./router');

  Actor = (function() {
    function Actor(options) {
      this.doProcess = __bind(this.doProcess, this);
      this.id = options.id, this.process = options.process;
      this.stream = router.getOrCreateRoute(this.id);
      this.unsubscribe = this.stream.onValue(this.doProcess);
    }

    Actor.prototype.doProcess = function(message) {
      var _doProcess, _i, _len, _message, _results;
      _doProcess = (function(_this) {
        return function(message) {
          var body, callback, err, receiver, result, sender;
          sender = message.sender, body = message.body, receiver = message.receiver, callback = message.callback;
          try {
            result = _this.process(body, sender, receiver);
            if (result && Q.isPromiseAlike(result)) {
              return result.then(function(result) {
                return callback(void 0, result);
              })["catch"](function(err) {
                return callback(err || new Error('Unexpected Error'));
              });
            } else {
              return callback(void 0, result);
            }
          } catch (_error) {
            err = _error;
            return callback(err);
          }
        };
      })(this);
      if (message != null ? message.length : void 0) {
        _results = [];
        for (_i = 0, _len = message.length; _i < _len; _i++) {
          _message = message[_i];
          _results.push(_doProcess(_message));
        }
        return _results;
      } else {
        return _doProcess(message);
      }
    };

    Actor.prototype.addTransformation = function(funktion) {
      this.unsubscribe();
      this.stream = funktion(this.stream);
      return this.unsubscribe = this.stream.onValue(this.doProcess);
    };

    Actor.prototype.send = function(receiver, message) {
      return router.send(this.id, receiver, message);
    };

    return Actor;

  })();

  module.exports = Actor;

}).call(this);

//# sourceMappingURL=..\maps\actor.js.map
