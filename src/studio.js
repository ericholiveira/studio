var key;
require('./util/promise_handlers');
var _Studio= {
    router: require('./router'),
    service: require('./service'),
    promise: require('bluebird'),
    exception: require('./exception'),
    module:function(moduleName){
        return function(options){
            if(typeof options === 'string'){
                return _Studio.ref(moduleName+'.'+options);
            }
            options.name = moduleName+'.'+options;
            return _Studio.service(options);
        };
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
for (key in _Studio){
    Studio[key] = _Studio[key];
}

module.exports=Studio;
