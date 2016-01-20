var router = require('./router');
var _Promise = require('bluebird');
var fs = require('fs');
var ref = require('./ref');
var exceptions = require('./exception');
var listeners = require('./util/listeners');
var generatorUtil = require('./util/generator');

var _getCallerFile=function (){
    try{
        var err = new Error();
        return err.stack.split('\n')[3].match(/\(.*\)/g)[0].split(':')[0].substring(1);
    }catch(e){
        return '';
    }
};

var _doProcess=function(self,message){
    var body = message.body;
    body.push(message.sender);
    body.push(message.receiver);
    var result;
    if(typeof self._filter === 'function'){
        result = self._filter.apply(self,body).then(function(res){
            if(res){
                return self.apply(self,body);
            }else{
                throw exceptions.FilteredMessageException(self.id);
            }
        });
    }else{
        result = self.apply(self,body);
    }
    if(self._timeout){
        result = result.timeout(self._timeout);
    }
    return result;
};

module.exports = function serviceFactory(options) {
    var _process, key;
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

    router.createRoute(options.id,_doProcess.bind(_process,_process));

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
        return result;
    };
    result.timeout = function(ts){
        _process._timeout = ts;
        return result;
    };
    result.watch = function(path){
        path = path || _getCallerFile();
        var watcher = fs.watch(path, function () {
            watcher.close();
            result.stop();
            delete require.cache[path];
            require(path);
        });
        return result;
    };

    return result;
};


