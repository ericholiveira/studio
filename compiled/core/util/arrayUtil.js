(function() {
  module.exports.isArray = Array.isArray || function(value) {
    return {}.toString.call(value) === '[object Array]';
  };

}).call(this);

//# sourceMappingURL=../../maps/arrayUtil.js.map
