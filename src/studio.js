var key;
var exception= require('./exception');
var isGeneratorFunction = require('./util/generator').isGeneratorFunction;
var _Studio= {
    router: require('./router'),
    service: require('./service'),
    serviceClass : function(_class){
        var _module = this.module(_class.name);
        var _instance = new _class();
        var keys = Object.keys(_instance).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(_instance)));
        keys.filter(function(k){
            return k !== 'constructor' && typeof _instance[k] === 'function';
        }).forEach(function(k){
            var forceGenerator = isGeneratorFunction(_instance[k]);
            _instance[k] = _module({
                id: k,
                fn:_instance[k].bind(_instance)
            },{forceGenerator:forceGenerator});
        });
        return _instance;
    },
    promise: require('bluebird'),
    exception: exception,
    defer:require('./util/promise_handlers'),
    module:function(moduleName){
      "use strict";
        var result = function(options,extra){
            if(typeof options === 'string'){
                return _Studio.ref(moduleName+'/'+options,extra);
            }
            if(!options.id && !options.name) throw exception.ServiceNameOrIdNotFoundException();
            options.id = options.id || options.name;
            options.id = moduleName+'/'+options.id;
            return _Studio.service(options,extra);
        };
        copyStudioProperties(result);
        result.module=function(module2){
          return _Studio.module(moduleName+'/'+module2);
        };
        result._moduleName = moduleName;
        return result;
    },
    use : function(plugin,filter){
        var self = this;
        return plugin({
            onStart:function(listener){require('./util/listeners').addOnStartListener(listener,filter,self._moduleName);},
            onStop:function(listener){require('./util/listeners').addOnStopListener(listener,filter,self._moduleName);},
            interceptSend:function(listener){require('./util/listeners').addInterceptSend(listener,filter,self._moduleName);}
        },Studio);
    },
    ref : require('./ref'),
    plugin : {
        timer:require('./plugin/timer'),
        timeout:require('./plugin/timeout'),
        JsMockito:require('./plugin/jsmockito'),
        retry:require('./plugin/retry'),
        richErrors:require('./plugin/rich_errors')
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
var Studio = function Studio(options, extra){
  "use strict";
    if(typeof options === 'string'){
        return _Studio.ref(options, extra);
    }
    return _Studio.service(options, extra);
};
function copyStudioProperties(destination){
  "use strict";
    for (key in _Studio){
        destination[key] = _Studio[key];
    }
}
copyStudioProperties(Studio);

Studio.use(require('./plugin/filter'));
module.exports=Studio;
