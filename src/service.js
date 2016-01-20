var router = require('./router');
var _Promise = require('bluebird');
var fs = require('fs');
var ref = require('./ref');
var exceptions = require('./exception');
var listeners = require('./util/listeners');
var generatorUtil = require('./util/generator');

var _doProcess=function(self,message){
    var body = message.body;
    body.push(message.sender);
    body.push(message.receiver);
    if(typeof self._filter === 'function'){
        return self._filter.apply(self,body).then(function(res){
            if(res){
                return self.apply(self,body);
            }else{
                throw exceptions.FilteredMessageException(self.id);
            }
        });
    }else{
        return self.apply(self,body);
    }

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
    listeners.notifyStart(options);
    if (generatorUtil.isGeneratorFunction(options.fn)) {
        _process = _Promise.coroutine(options.fn);
    } else {
        _process = _Promise.method(options.fn);
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
        listeners.notifyStop(result);
        //destroy listener
    };
    result.start = function(){
        serviceFactory(options);
    };

    result.filter = function(fn){
        _process._filter = generatorUtil.toAsync(fn);
    };

    return result;
};


