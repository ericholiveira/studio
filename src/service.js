var router = require('./router');
var _Promise = require('bluebird');
var ref = require('./ref');
var logging= require('./logging');
var exceptions = require('./exception');
var listeners = require('./util/listeners');
var generatorUtil = require('./util/generator');
var clone = require('./util/clone');
module.exports = function serviceFactory(options, extra) {

    "use strict";
    var _process, serv;
    extra = extra || {};
    if (typeof options === 'function') {
        _process = options;
        options = {
            id : options.id,
            name: options.name,
            fn: _process
        };
    }
    logging.instance.log('Creating service ' + options.name);
    options.id = options.id || options.name;
    if (!options.id){
        logging.instance.error('Throwing error ServiceNameOrIdNotFoundException');
        throw exceptions.ServiceNameOrIdNotFoundException();
    }
    if (!options.fn){
        logging.instance.error('Throwing error ServiceNameOrIdNotFoundException');
        throw exceptions.ServiceFunctionNotFoundException();
    }
    serv = clone(options);
    serv.fn = generatorUtil.toAsync(serv.fn,extra.forceGenerator);
    serv.__plugin_info={};

    router.createRoute(serv.id,serv);

    var result = ref(options.id);
    result.stop = function(){
        logging.instance.error('Service: stop ' + options.name);
        router.deleteRoute(options.id);
        listeners.notifyStop(serv);
    };
    result.start = function(){
        logging.instance.error('Service: start ' + options.name);
        serviceFactory(options);
    };
    serv.__plugin_info.ref = result;
    listeners.notifyStart(serv);

    return result;
};
