(function() {
  var BaseClass, csextends;

  csextends = require('csextends');

  BaseClass = (function() {
    function BaseClass() {}

    BaseClass["extends"] = function(options) {
      return csextends(this, options);
    };

    return BaseClass;

  })();

  module.exports = BaseClass;

}).call(this);

//# sourceMappingURL=../../maps/baseClass.js.map
