(function() {
  var Bacon, Driver, router;

  Bacon = require('baconjs');

  router = require('./router');

  Driver = (function() {
    function Driver(options) {
      this.parser = options.parser;
    }

    Driver.prototype.deliver = function(sender, receiver, message) {
      return router.sendMessage(sender, receiver, message);
    };

    return Driver;

  })();

  module.exports = Driver;

}).call(this);

//# sourceMappingURL=../maps/driver.js.map
