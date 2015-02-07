(function() {
  var Actor, ArrayUtil, BaseClass, Promise, clone, router,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  router = require('./router');

  BaseClass = require('./util/baseClass');

  Promise = require('bluebird');

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
      this.unsubscribe = this.stream.onValue((function(_this) {
        return function(message) {
          return _this._doProcess(message)["catch"](function() {});
        };
      })(this));
      if (typeof this.initialize === "function") {
        this.initialize(options);
      }
    }

    Actor.prototype._doProcess = function(message) {
      var __doProcess, _i, _len, _message, _results;
      __doProcess = (function(_this) {
        return function(message) {
          var body, callback, headers, receiver, sender;
          sender = message.sender, body = message.body, receiver = message.receiver, callback = message.callback, headers = message.headers;
          return Promise.attempt(function() {
            return _this.process(body, headers, sender, receiver);
          }).then(function(result) {
            callback(void 0, result);
            return result;
          })["catch"](function(err) {
            err = err || new Error('Unexpected Error');
            callback(err || new Error('Unexpected Error'));
            throw err;
          });
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

    Actor.prototype.send = function(receiver, message, headers) {
      if (headers == null) {
        headers = {};
      }
      return router.send(this.id, receiver, message, headers);
    };

    Actor.prototype.mapRoute = function(routePattern) {
      var allRoutes, container, route, that, _i, _j, _k, _len, _len1, _len2, _mapRouteWithProxy, _route;
      that = this;
      container = {};
      _mapRouteWithProxy = function() {
        return Proxy.create({
          get: function(target, name) {
            return function(message) {
              return that.send(name, message);
            };
          }
        });
      };
      if ((typeof Proxy !== "undefined" && Proxy !== null) && typeof Proxy.create === 'function') {
        return _mapRouteWithProxy();
      } else {
        if (routePattern == null) {
          allRoutes = router.getAllRoutes();
          for (_i = 0, _len = allRoutes.length; _i < _len; _i++) {
            route = allRoutes[_i];
            _route = clone(route);
            container[route] = (function(_this) {
              return function(message) {
                return _this.send(_route, message);
              };
            })(this);
          }
        } else if (routePattern instanceof RegExp) {
          allRoutes = router.getAllRoutes();
          for (_j = 0, _len1 = allRoutes.length; _j < _len1; _j++) {
            route = allRoutes[_j];
            if (!(routePattern.test(route))) {
              continue;
            }
            _route = clone(route);
            container[route] = (function(_this) {
              return function(message) {
                return _this.send(_route, message);
              };
            })(this);
          }
        } else if (ArrayUtil.isArray(routePattern)) {
          for (_k = 0, _len2 = routePattern.length; _k < _len2; _k++) {
            route = routePattern[_k];
            container[route] = (function(_this) {
              return function(message) {
                return _this.send(route, message);
              };
            })(this);
          }
        } else {
          container[routePattern] = (function(_this) {
            return function(message) {
              return _this.send(routePattern, message);
            };
          })(this);
        }
        return container;
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

    Actor.prototype.toString = function() {
      return this.id;
    };

    return Actor;

  })(BaseClass);

  module.exports = Actor;

}).call(this);

//# sourceMappingURL=../maps/actor.js.map
