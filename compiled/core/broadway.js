(function() {
  var oldBroadway, _global;

  _global = (typeof window !== "undefined" && window !== null) && window || {};

  oldBroadway = _global.Broadway;

  module.exports = _global.Broadway = {
    router: require('./router'),
    Actor: require('./actor'),
    Driver: require('./driver'),
    noConflict: function() {
      var Broadway;
      Broadway = _global.Broadway;
      if (typeof oldBroadway !== 'undefined') {
        _global.Broadway = oldBroadway;
      } else {
        delete _global.Broadway;
      }
      return Broadway;
    }
  };

}).call(this);

//# sourceMappingURL=../maps/broadway.js.map
