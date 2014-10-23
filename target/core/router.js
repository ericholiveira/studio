(function() {
  var Bacon, Q, Router, Timer;

  Timer = require('./util/timer');

  Q = require('q');

  Bacon = require('baconjs');

  Router = (function() {
    function Router() {}

    Router.prototype.routes = {
      broadcast: {
        stream: new Bacon.Bus()
      }
    };

    Router.prototype.filters = [];

    Router.prototype.registerActor = function(actor) {
      var filter, stream, _i, _len, _ref;
      if (!this.routes[actor.id]) {
        stream = new Bacon.Bus();
        stream.plug(this.routes.broadcast.stream);
        this.routes[actor.id] = {
          stream: stream
        };
      }
      _ref = this.filters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        if (filter.regex.test(actor.id)) {
          this.addFilterToRoute(actor.id, filter);
        }
      }
      return this.routes[actor.id].stream;
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
          _results.push(this.addFilterToRoute(id, filter));
        }
      }
      return _results;
    };

    Router.prototype.addFilterToRoute = function(id, filter) {
      var _ref;
      if ((_ref = this.routes[id]) != null) {
        _ref.filters = this.routes[id].filters || [];
      }
      return this.routes[id].filters.push(filter);
    };

    Router.prototype.sendMessage = function(sender, receiver, message) {
      var defer, filter, route, _fn, _i, _len, _message, _ref;
      defer = Q.defer();
      route = this.routes[receiver];
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
      _ref = route.filters || [];
      _fn = function(filter) {
        var result;
        result = filter.filter(_message);
        if (result != null) {
          return _message = result;
        }
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        _fn(filter);
      }
      if (_message !== false) {
        Timer.enqueue(function() {
          return route.stream.push(_message);
        });
      }
      return defer.promise;
    };

    return Router;

  })();

  module.exports = new Router();

}).call(this);

//# sourceMappingURL=../maps/router.js.map
