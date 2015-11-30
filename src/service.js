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
    try{
        var result = self.apply(self,body);
        return Promise.resolve(result);
    }catch(err){
        return Promise.reject(err);
    }
};
var isGeneratorFunction = function (obj) {
    var constructor = obj.constructor || {};
    return 'GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName;
};

module.exports = function serviceFactory(options) {
    var name, _process, key, watch, watcher;
    if (typeof options === 'function') {
        name = options.name;
        _process = options;
        options = {
            name: name,
            process: _process
        };
    }
    if (!options.name) throw new Error('You must provide a name');
    if (!options.process) throw new Error('You must provide a process function');
    if (isGeneratorFunction(options.process)) {
        _process = _Promise.coroutine(options.process);
    } else {
        _process = options.process;
    }
    for (key in options) {
        if (key !== 'process') {
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
    _process.destroy = function(){
        router.deleteRoute(_process.id);
        //destroy listener
    };
    router.createRoute(options.name,_doProcess.bind(_process,_process));
    //add listener

    //start
    //stop (@process = ()-> throw new Error('Stopped'))
    //send
    //bindSend
    //sendWithTimeout
    //addTransformation plugin
    return ref(_process.name);
};


