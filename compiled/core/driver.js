(function() {
  var Bacon, BaseClass, Driver, router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Bacon = require('baconjs');

  router = require('./router');

  BaseClass = require('./util/baseClass');

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
      var args, body, receiver, sender, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref = this.parser.apply(this, args), sender = _ref.sender, receiver = _ref.receiver, body = _ref.body;
      return router.send(sender, receiver, body);
    };

    return Driver;

  })(BaseClass);

  module.exports = Driver;

}).call(this);

//# sourceMappingURL=..\maps\driver.js.map
