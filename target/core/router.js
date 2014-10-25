(function() {
  var Bacon, Q, Router, Timer;

  Timer = require('./util/timer');

  Q = require('q');

  Bacon = require('baconjs');

  Router = (function() {
    function Router() {}

    Router.prototype._routes = {
      broadcast: {
        stream: new Bacon.Bus()
      }
    };

    Router.prototype._filters = [];

    Router.prototype.getOrCreateRoute = function(id) {
      var stream;
      if (!this._routes[id]) {
        stream = new Bacon.Bus();
        stream.plug(this._routes.broadcast.stream);
        this._routes[id] = {
          stream: stream
        };
      }
      return this._routes[id].stream;
    };

    Router.prototype.send = function(sender, receiver, message) {
      var defer, route, _message;
      defer = Q.defer();
      route = this._routes[receiver];
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

    return Router;

  })();

  module.exports = new Router();

}).call(this);

//# sourceMappingURL=..\maps\router.js.map
