(function() {
  var Actor, ActorFactory, InterceptorFactory, Q, actors, interceptors, proxies, router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Actor = require('./actor');

  router = require('./router');

  Q = require('q');

  interceptors = [];

  actors = [];

  proxies = [];

  ActorFactory = (function(_super) {
    __extends(ActorFactory, _super);

    function ActorFactory() {
      return ActorFactory.__super__.constructor.apply(this, arguments);
    }

    ActorFactory.prototype.process = function(options) {
      var process, proxy;
      options._innerProcess = options.process;
      process = function(body, sender, receiver) {
        var interceptor, message, produceNext, toCallInterceptors, _i, _len;
        toCallInterceptors = [];
        for (_i = 0, _len = interceptors.length; _i < _len; _i++) {
          interceptor = interceptors[_i];
          if (interceptor.route[receiver]) {
            toCallInterceptors.push(interceptor);
          }
        }
        message = {
          body: body,
          sender: sender,
          receiver: receiver
        };
        produceNext = (function(_this) {
          return function(index, message) {
            var nextRoute;
            if (index === toCallInterceptors.length - 1) {
              return function() {
                return Q.fcall(function() {
                  return _this._innerProcess(body, sender, receiver);
                });
              };
            } else {
              nextRoute = toCallInterceptors[index + 1].interceptor.id;
              return function() {
                message.next = produceNext(index + 1, message);
                return router.send(sender, nextRoute, message);
              };
            }
          };
        })(this);
        if (toCallInterceptors.length === 0) {
          return Q.fcall((function(_this) {
            return function() {
              return _this._innerProcess(body, sender, receiver);
            };
          })(this));
        } else {
          message.next = produceNext(0, message);
          return router.send(sender, toCallInterceptors[0].interceptor.id, message);
        }
      };
      options.process = process;
      proxy = new Actor(options);
      return proxy;
    };

    return ActorFactory;

  })(Actor);

  InterceptorFactory = (function(_super) {
    __extends(InterceptorFactory, _super);

    function InterceptorFactory() {
      return InterceptorFactory.__super__.constructor.apply(this, arguments);
    }

    InterceptorFactory.prototype.process = function(options) {
      var clazz, interceptor;
      clazz = options.clazz || Actor;
      interceptor = new clazz(options);
      interceptors.push({
        interceptor: interceptor,
        route: this.mapRoute(options.routes)
      });
      return interceptor;
    };

    return InterceptorFactory;

  })(Actor);

  module.exports = {
    actorFactory: new ActorFactory({
      id: 'createActor'
    }),
    interceptorFactory: new InterceptorFactory({
      id: 'addInterceptor'
    })
  };

}).call(this);

//# sourceMappingURL=..\maps\actorFactory.js.map
