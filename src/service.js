var router = require('./router');
var _Promise = require('bluebird');
var fs = require('fs');
var ref = require('./ref');
var exceptions = require('./exception');
//listeners = require('./util/listeners')

var _doProcess=function(self,message){
    var body = message.body;
    body.push(message.sender);
    body.push(message.receiver);
    return _Promise.method(self).apply(self,body);
};
var isGeneratorFunction = function (obj) {
    var constructor = obj.constructor || {};
    return 'GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName;
};

module.exports = function serviceFactory(options) {
    var _process, key, watch, watcher;
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
    if (isGeneratorFunction(options.fn)) {
        _process = _Promise.coroutine(options.fn);
    } else {
        _process = options.fn;
    }
    for (key in options) {
        if (key !== 'fn') {
            _process[key] = options[key];
        }
    }
    if (options.watchPath) {
        watch = options.watchPath;
        watcher = fs.watch(watch, function () {
            watcher.close();
            _process.destroy();
            delete require.cache[watch];
            require(watch);
        });
    }


    router.createRoute(options.id,_doProcess.bind(_process,_process));
    //add listener

    //start
    //stop (@process = ()-> throw new Error('Stopped'))
    //send
    //bindSend
    //sendWithTimeout
    //addTransformation plugin
    var result = ref(options.id);
    result.stop = function(){
        router.deleteRoute(options.id);
        //destroy listener
    };
    result.start = function(){
        serviceFactory(options);
    };
    return result;
};


