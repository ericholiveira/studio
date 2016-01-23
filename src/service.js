var router = require('./router');
var _Promise = require('bluebird');
var ref = require('./ref');
var exceptions = require('./exception');
var listeners = require('./util/listeners');
var generatorUtil = require('./util/generator');
var clone = require('./util/clone');

var _doProcess=function(message){
    var body = message.body;
    body.push(message.sender);
    body.push(message.receiver);
    return this.fn.apply(this,body);
};

module.exports = function serviceFactory(options) {
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

    router.createRoute(serv.id,_doProcess.bind(serv));

    var result = ref(options.id);
    result.stop = function(){
        router.deleteRoute(options.id);
        listeners.notifyStop(serv);
    };
    result.start = function(){
        serviceFactory(options);
    };
    serv.__plugin_info.ref = result;
    listeners.notifyStart(serv);

    return result;
};


