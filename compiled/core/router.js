(function() {
  var Bacon, Q, Router, Timer, clone, _routes;

  Timer = require('./util/timer');

  Q = require('q');

  Bacon = require('baconjs');

  clone = require('./util/clone');

  _routes = {};

  Router = (function() {
    function Router() {}

    Router.prototype.createOrGetRoute = function(id) {
      var stream;
      if (!_routes[id]) {
        stream = new Bacon.Bus();
        _routes[id] = {
          stream: stream
        };
      }
      return _routes[id].stream;
    };

    Router.prototype.getRoute = function(id) {
      return _routes[id];
    };

    Router.prototype.send = function(sender, receiver, message) {
      var defer, route, _message;
      defer = Q.defer();
      route = _routes[receiver];
      _message = {
        sender: sender,
        receiver: receiver,
        body: message,
        callback: function(err, result) {
          if (err) {
            return defer.reject(err);
          } else {
            return defer.resolve(result);
          }
        }
      };
      Timer.enqueue(function() {
        return route.stream.push(_message);
      });
      return defer.promise;
    };

    Router.prototype.getAllRoutes = function() {
      var route, _results;
      _results = [];
      for (route in _routes) {
        _results.push(route);
      }
      return _results;
    };

    return Router;

  })();

  module.exports = new Router();

}).call(this);

//# sourceMappingURL=..\maps\router.js.map
