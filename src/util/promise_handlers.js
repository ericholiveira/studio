var _Promise = require('bluebird');
var promise = null;
var defer = function() {
  "use strict";
    var _resolve;
    var _reject;
    promise = new _Promise(function(resolve,reject){
        _resolve = resolve;
        _reject = reject;
    });
    return function(e,r){
        if(e) return _reject(e);
        _resolve(r);
    };
};
_Promise.coroutine.addYieldHandler(function(yieldedValue) {
  "use strict";
    var _promise;
    if (Array.isArray(yieldedValue)) return Promise.all(yieldedValue);
    if (promise !== null) {
        _promise = promise;
        promise = null;
        return _promise;
    }
    return Promise.resolve(yieldedValue);
});
module.exports = defer;
