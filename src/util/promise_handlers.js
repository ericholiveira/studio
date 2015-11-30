var _Promise = require('bluebird');
_Promise.coroutine.addYieldHandler(function(yieldedValue) {
    if (Array.isArray(yieldedValue)) return Promise.all(yieldedValue);
    return Promise.resolve(yieldedValue);
});