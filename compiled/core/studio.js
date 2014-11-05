(function() {
  var oldStudio, _global;

  _global = (typeof window !== "undefined" && window !== null) && window || {};

  oldStudio = _global.Studio;

  module.exports = _global.Studio = {
    router: require('./router'),
    Actor: require('./actor'),
    Driver: require('./driver'),
    noConflict: function() {
      var Studio;
      Studio = _global.Studio;
      if (typeof oldStudio !== 'undefined') {
        _global.Studio = oldStudio;
      } else {
        delete _global.Studio;
      }
      return Studio;
    }
  };

}).call(this);

//# sourceMappingURL=../maps/studio.js.map
