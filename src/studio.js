var key;
var exception= require('./exception');
var _Studio= {
    router: require('./router'),
    service: require('./service'),
    promise: require('bluebird'),
    exception: exception,
    defer:require('./util/promise_handlers'),
    module:function(moduleName){
        var result = function(options){
            if(typeof options === 'string'){
                return _Studio.ref(moduleName+'/'+options);
            }
            if(!options.id && !options.name) throw exception.ServiceNameOrIdNotFoundException();
            options.id = options.id || options.name;
            options.id = moduleName+'/'+options.id;
            return _Studio.service(options);
        };
        copyStudioProperties(result);
        result.module=function(module2){
          return _Studio.module(moduleName+'/'+module2);
        };
        return result;
    },
    /*use : (plugin)->
     plugin({
     interceptSend:(funk)->
     _send = Studio.router.send
     Studio.router.send = funk(_send.bind(Studio.router))
     listenTo:{
     onCreateActor:(listener)-> require('./util/listeners').addOnCreateActor(listener)
     onDestroyActor:(listener)-> require('./util/listeners').addOnDestroyActor(listener)
     onCreateDriver:(listener)-> require('./util/listeners').addOnCreateDriver(listener)
     onDestroyDriver:(listener)-> require('./util/listeners').addOnDestroyDriver(listener)
     }       },Studio)*/
    ref : require('./ref')

};

var Studio = function Studio(options){
    if(typeof options === 'string'){
        return _Studio.ref(options);
    }
    return _Studio.service(options);
};
function copyStudioProperties(destination){
    for (key in _Studio){
        destination[key] = _Studio[key];
    }
}
copyStudioProperties(Studio);

module.exports=Studio;
