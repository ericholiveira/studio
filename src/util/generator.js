var _Promise = require('bluebird');
module.exports = {
    isGeneratorFunction : function (obj) {
      "use strict";
        var constructor = obj.constructor || {};
        return 'GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName;
    },
    toAsync: function(fn,forceGenerator){
      "use strict";
        if (forceGenerator || this.isGeneratorFunction(fn)) {
            return _Promise.coroutine(fn);
        }
        return _Promise.method(fn);
    }
};
