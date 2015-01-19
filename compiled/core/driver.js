(function() {
  var Bacon, BaseClass, Driver, Q, router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Bacon = require('baconjs');

  router = require('./router');

  BaseClass = require('./util/baseClass');

  Q = require('q');

  Driver = (function(_super) {
    __extends(Driver, _super);

    function Driver(options) {
      var property;
      for (property in options) {
        this[property] = options[property];
      }
      if (!this.parser) {
        throw new Error('You must provide a parser function');
      }
      if (typeof this.initialize === "function") {
        this.initialize(options);
      }
    }

    Driver.prototype.send = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Q.fcall((function(_this) {
        return function() {
          return _this.parser.apply(_this, args);
        };
      })(this)).then(function(result) {
        var body, headers, receiver, sender;
        sender = result.sender, receiver = result.receiver, body = result.body, headers = result.headers;
        return router.send(sender, receiver, body, headers);
      });
    };

    return Driver;

  })(BaseClass);

  module.exports = Driver;

}).call(this);

//# sourceMappingURL=../maps/driver.js.map
