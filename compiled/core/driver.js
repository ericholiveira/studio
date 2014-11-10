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
      var parser;
      parser = options.parser;
      this.send = function() {
        var args, message, receiver, sender, _ref;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        _ref = parser.apply(null, args), sender = _ref.sender, receiver = _ref.receiver, message = _ref.message;
        return router.send(sender, receiver, message);
      };
    }

    return Driver;

  })(BaseClass);

  module.exports = Driver;

}).call(this);

//# sourceMappingURL=..\maps\driver.js.map
