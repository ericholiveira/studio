(function() {
  var Bacon, Promise, Router, Timer, clone, _routes;

  Timer = require('./util/timer');

  Promise = require('bluebird');

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

    Router.prototype.send = function(sender, receiver, message, headers) {
      if (headers == null) {
        headers = {};
      }
      return new Promise(function(resolve, reject) {
        var route, _message;
        route = _routes[receiver];
        _message = {
          sender: sender,
          receiver: receiver,
          body: message,
          headers: headers,
          callback: function(err, result) {
            if (err) {
              return reject(err);
            } else {
              return resolve(result);
            }
          }
        };
        if (route != null) {
          return Timer.enqueue(function() {
            return route.stream.push(_message);
          });
        } else {
          return reject(new Error("The route " + receiver + " doesn't exists"));
        }
      });
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

//# sourceMappingURL=../maps/router.js.map
