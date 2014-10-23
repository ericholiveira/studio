(function() {
  var Q, Router, Timer;

  Timer = require('./util/timer');

  Q = require('q');

  Router = (function() {
    function Router() {}

    Router.prototype.routes = {};

    Router.prototype.filters = [];

    Router.prototype.registerActor = function(actor) {
      return this.routes[actor.id] = {
        actor: actor
      };
    };

    Router.prototype.registerFilter = function(regex, filter) {
      var id, _results;
      this.filters.push({
        regex: regex,
        filter: filter
      });
      _results = [];
      for (id in this.routes) {
        if (regex.test(id)) {
          _results.push((function(id) {
            return addFilterToRoute(id, filter);
          })(id));
        }
      }
      return _results;
    };

    Router.prototype.addFilterToRoute = function(id, filter) {
      var _ref;
      return (_ref = this.routes[id]) != null ? _ref.filter = filter : void 0;
    };

    Router.prototype.sendMessage = function(sender, receiver, message) {
      var defer, route;
      defer = Q.defer();
      route = this.routes[receiver];
      Timer.enqueue(function() {
        var err, filter, result, _fn, _i, _len, _ref;
        try {
          _ref = route.filters;
          _fn = function(filter) {
            return message = filter.filter(message, sender);
          };
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            filter = _ref[_i];
            _fn(filter);
          }
          result = route.actor.process(message, sender);
          if (result && Q.isPromiseAlike(result)) {
            return result.then(defer.resolve)["catch"](defer.reject);
          } else {
            return defer.resolve(result);
          }
        } catch (_error) {
          err = _error;
          return defer.reject(err);
        }
      });
      return defer.promise;
    };

    return Router;

  })();

  module.exports = new Router();

}).call(this);

//# sourceMappingURL=..\maps\router.js.map
