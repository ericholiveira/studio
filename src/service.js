var router = require('./router');
var _Promise = require('bluebird');
var ref = require('./ref');
var exceptions = require('./exception');
var listeners = require('./util/listeners');
var generatorUtil = require('./util/generator');
var clone = require('./util/clone');
module.exports = function serviceFactory(options) {
  "use strict";
  var _process, key, serv;
    if (typeof options === 'function') {
        _process = options;
        options = {
            id : options.id,
            name: options.name,
            fn: _process
        };
    }
    options.id = options.id || options.name;
    if (!options.id) throw exceptions.ServiceNameOrIdNotFoundException();
    if (!options.fn) throw exceptions.ServiceFunctionNotFoundException();
    serv = clone(options);
    serv.fn = generatorUtil.toAsync(serv.fn);
    serv.__plugin_info={};

    router.createRoute(serv.id,serv);

    var result = ref(options.id);
    result.stop = function(){
      "use strict";
        router.deleteRoute(options.id);
        listeners.notifyStop(serv);
    };
    result.start = function(){
      "use strict";
        serviceFactory(options);
    };
    serv.__plugin_info.ref = result;
    listeners.notifyStart(serv);

    return result;
};
