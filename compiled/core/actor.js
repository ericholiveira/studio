(function() {
  var Actor, ArrayUtil, BaseClass, Q, clone, router,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  router = require('./router');

  BaseClass = require('./util/baseClass');

  Q = require('q');

  clone = require('./util/clone');

  ArrayUtil = require('./util/arrayUtil');

  Actor = (function(_super) {
    __extends(Actor, _super);

    function Actor(options) {
      this._doProcess = __bind(this._doProcess, this);
      var property;
      for (property in options) {
        this[property] = options[property];
      }
      if (!this.id) {
        throw new Error('You must provide an id');
      }
      if (!this.process) {
        throw new Error('You must provide a process function');
      }
      this.stream = router.createOrGetRoute(this.id).map(function(message) {
        return clone(message);
      });
      this.unsubscribe = this.stream.onValue(this._doProcess);
      if (typeof this.initialize === "function") {
        this.initialize(options);
      }
    }

    Actor.prototype._doProcess = function(message) {
      var __doProcess, _i, _len, _message, _results;
      __doProcess = (function(_this) {
        return function(message) {
          var body, callback, err, receiver, result, sender;
          sender = message.sender, body = message.body, receiver = message.receiver, callback = message.callback;
          try {
            result = _this.process(body, sender, receiver);
            if (result && Q.isPromiseAlike(result)) {
              return result.then(function(result) {
                return callback(void 0, result);
              })["catch"](function(err) {
                if (typeof _this.errorHandler === "function") {
                  _this.errorHandler(err, message);
                }
                return callback(err || new Error('Unexpected Error'));
              });
            } else {
              return callback(void 0, result);
            }
          } catch (_error) {
            err = _error;
            if (typeof _this.errorHandler === "function") {
              _this.errorHandler(err, message);
            }
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

    Actor.prototype.attachRoute = function(routePattern) {
      var allRoutes, route, _i, _j, _len, _len1, _ref, _results, _results1;
      allRoutes = router.getAllRoutes();
      if (routePattern instanceof RegExp) {
        _results = [];
        for (_i = 0, _len = allRoutes.length; _i < _len; _i++) {
          route = allRoutes[_i];
          if (routePattern.test(route)) {
            _results.push(this[route] = (function(_this) {
              return function(message) {
                return _this.send(route, message);
              };
            })(this));
          }
        }
        return _results;
      } else if (ArrayUtil.isArray(routePattern)) {
        _ref = ArrayUtil.intersection(routePattern, allRoutes);
        _results1 = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          route = _ref[_j];
          _results1.push(this[route] = (function(_this) {
            return function(message) {
              return _this.send(route, message);
            };
          })(this));
        }
        return _results1;
      } else {
        return this[routePattern] = (function(_this) {
          return function(message) {
            return _this.send(allRoutes[routePattern], message);
          };
        })(this);
      }
    };

    Actor.prototype.stop = function() {
      this._process = this.process;
      return this.process = function() {
        throw new Error('Stopped');
      };
    };

    Actor.prototype.start = function() {
      return this.process = this._process || this.process;
    };

    return Actor;

  })(BaseClass);

  module.exports = Actor;

}).call(this);

//# sourceMappingURL=..\maps\actor.js.map
