(function() {
  var Actor, BaseClass, Q, clone, router,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  router = require('./router');

  BaseClass = require('./util/baseClass');

  Q = require('q');

  clone = require('./util/clone');

  Actor = (function(_super) {
    __extends(Actor, _super);

    function Actor(options) {
      this._doProcess = __bind(this._doProcess, this);
      this.id = options.id, this.process = options.process;
      this.stream = router.createOrGetRoute(this.id);
      this.unsubscribe = this.stream.onValue(this._doProcess);
    }

    Actor.prototype._doProcess = function(message) {
      var __doProcess, _i, _len, _message, _results;
      __doProcess = (function(_this) {
        return function(message) {
          var body, callback, err, receiver, result, sender, _ref;
          _ref = clone(message), sender = _ref.sender, body = _ref.body, receiver = _ref.receiver, callback = _ref.callback;
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
          _results.push(__doProcess(_message));
        }
        return _results;
      } else {
        return __doProcess(message);
      }
    };

    Actor.prototype.addTransformation = function(funktion) {
      this.unsubscribe();
      this.stream = funktion(this.stream);
      return this.unsubscribe = this.stream.onValue(this._doProcess);
    };

    Actor.prototype.send = function(receiver, message) {
      return router.send(this.id, receiver, message);
    };

    return Actor;

  })(BaseClass);

  module.exports = Actor;

}).call(this);

//# sourceMappingURL=..\maps\actor.js.map
