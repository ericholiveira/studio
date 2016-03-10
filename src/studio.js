var key;
var exception= require('./exception');
var _Studio= {
    router: require('./router'),
    service: require('./service'),
    promise: require('bluebird'),
    exception: exception,
    defer:require('./util/promise_handlers'),
    module:function(moduleName){
      "use strict";
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
        result._moduleName = moduleName;
        return result;
    },
    use : function(plugin,filter){
        return plugin({
            onStart:function(listener){require('./util/listeners').addOnStartListener(listener,filter);},
            onStop:function(listener){require('./util/listeners').addOnStopListener(listener,filter);}
        },Studio);
    },
    ref : require('./ref'),
    plugin : {
        timer:require('./plugin/timer'),
        timeout:require('./plugin/timeout'),
        restify:require('./plugin/restify'),
        JsMockito:require('./plugin/jsmockito'),
        retry:require('./plugin/retry'),
        watch:require('./plugin/watch') // ALPHA , avoid usage in production
    }
};
if(typeof Proxy !=='undefined'){
    var _Proxy = require('harmony-proxy');
    var createProxy = function(context){
        var contextFunction = function(){};
        var container={};
        var base = context._moduleName || '';
        var baseRef= Studio.ref(base);
        return new _Proxy(contextFunction, {
            "get": function (target, name) {
                if(!container[name]){
                    container[name] = createProxy(context.module(name));
                }
                return container[name];
            },
            "set":function(){},
            "apply":function(target, thisArg, argumentsList){
                return baseRef.apply(thisArg,argumentsList);
            }
        });
    };
    _Studio.services=function(){
        return createProxy(this);
    };
}
var Studio = function Studio(options){
  "use strict";
    if(typeof options === 'string'){
        return _Studio.ref(options);
    }
    return _Studio.service(options);
};
function copyStudioProperties(destination){
  "use strict";
    for (key in _Studio){
        destination[key] = _Studio[key];
    }
}
copyStudioProperties(Studio);

Studio.use(require('./plugin/filter'));
Studio.use(require('./plugin/watch'));
module.exports=Studio;
