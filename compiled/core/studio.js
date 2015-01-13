(function() {
  var factories, oldStudio, _global;

  factories = require('./actorFactory');

  _global = this || {};

  oldStudio = _global.Studio;

  module.exports = _global.Studio = {
    router: require('./router'),
    Actor: require('./actor'),
    Driver: require('./driver'),
    actorFactory: factories.actorFactory,
    interceptorFactory: factories.interceptorFactory,
    Q: require('q'),
    Bacon: require('baconjs'),
    noConflict: function() {
      if (typeof oldStudio !== 'undefined') {
        _global.Studio = oldStudio;
      } else {
        delete _global.Studio;
      }
      return this;
    }
  };

}).call(this);

//# sourceMappingURL=..\maps\studio.js.map
