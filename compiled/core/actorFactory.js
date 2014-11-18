(function() {
  var Actor, ActorFactory, InterceptorFactory, interceptors, router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Actor = require('./actor');

  router = require('./router');

  interceptors = [];

  ActorFactory = (function(_super) {
    __extends(ActorFactory, _super);

    function ActorFactory() {
      return ActorFactory.__super__.constructor.apply(this, arguments);
    }

    ActorFactory.prototype.process = function(options) {
      var process, proxy;
      options.clazz = options.clazz || Actor;
      process = function(body, sender, receiver) {
        var interceptor, message, produceNext, toCallInterceptors, _i, _len;
        for (_i = 0, _len = interceptors.length; _i < _len; _i++) {
          interceptor = interceptors[_i];
          if (interceptor.route[receiver]) {
            toCallInterceptors = interceptor.interceptor;
          }
        }
        message = {
          body: body,
          sender: sender,
          receiver: receiver
        };
        produceNext = function(index, message) {
          var nextRoute;
          if (index === toCallInterceptors.length - 1) {
            return function() {
              return router.send(sender, "" + receiver + "__original", body);
            };
          } else {
            nextRoute = toCallInterceptors[index + 1].route;
            return function() {
              message.next = produceNext(index + 1, message);
              return router.send(sender, nextRoute, message);
            };
          }
        };
        if (toCallInterceptors.length === 0) {
          return router.send(sender, "" + receiver + "__original", body);
        } else {
          message.next = produceNext(0, message);
          return router.send(sender, toCallInterceptors[0].route, message);
        }
      };
      proxy = new Actor({
        id: id,
        route: route,
        process: process
      });
      options.id = "" + options.id + "__original";
      options.route = "" + options.route + "__original";
      return new clazz(options);
    };

    return ActorFactory;

  })(Actor);

  InterceptorFactory = (function(_super) {
    __extends(InterceptorFactory, _super);

    function InterceptorFactory() {
      return InterceptorFactory.__super__.constructor.apply(this, arguments);
    }

    InterceptorFactory.prototype.process = function(options) {
      return interceptors.push({
        interceptor: options.interceptor,
        route: this.mapRoute(options.routes)
      });
    };

    return InterceptorFactory;

  })(Actor);

  module.exports = {
    actorFactory: new ActorFactory({
      id: '__actorFactorySingleton',
      route: 'createActor'
    }),
    interceptorFactory: new InterceptorFactory({
      id: '__interceptorFactorySingleton',
      route: 'interceptRoute'
    })
  };

}).call(this);

//# sourceMappingURL=..\maps\actorFactory.js.map
