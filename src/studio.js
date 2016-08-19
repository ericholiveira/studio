var key;
var exception= require('./exception');
var isGeneratorFunction = require('./util/generator').isGeneratorFunction;
/** 
    @module Studio
    This is the main object exposing all Studio methods
*/
var _Studio= {
    router: require('./router'),
    service: require('./service'),
    /** @function
    * @name serviceClass
    * @desc Create a service for each method of a given es6 Class.
    * The class MUST support an empty constructor and the methods can call other methods of this
    * The class name will become a module on Studio.
    * class using this
    * @param {Class} _class. An es6 class
    * @return {Object} An instance of this class with all their methods loaded by Studio
    * @example
    * class FooBar{
    *   foo(param){
    *       return this.bar(param);
    *   }
    *   bar(param){
    *       return param+' says FooBar';
    *   }
    * }
    * Studio.serviceClass(FooBar);// Loads all methods
    * let fooBarModule = Studio.module('FooBar');
    * let fooService = fooBarModule('foo');
    * fooService('John').then((result)=>{
    *   console.log(result); // Prints 'John says FooBar'
    * });
    */ 
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
    /** Studio exposes Bluebird promises */
    promise: require('bluebird'),
    /** All internal Studio exceptions */
    exception: exception,
    /** @function
    * @name defer
    * @desc Enables the support of node-style callbacks inside a generator (es6 only).
    * This function doesnt receive any parameter, think of this as flag for Studio to
    * wait for the result of a callback without stoping the event loop. MUST be used with
    * the 'yield' keyword
    * @example
    * let fs = require('fs');
    * Studio(function * readFile(fileName){
    *   let fileContent = yield fs.readFile(fileName,Studio.defer()); //Studio.defer() instead of a callbakc
    *   return fileContent;
    * });
    * let readFileService = Studio('readFile');
    * readFileService('foo.txt').then((result)=>{
    *   console.log(result); // Prints the content of foo.txt
    * });
    */ 
    defer:require('./util/promise_handlers'),
    module:function(moduleName){
      "use strict";
        var result = function(options,extra){
            if(typeof options === 'string'){
                return result.ref(options,extra);
            }
            return result.service(options,extra);
        };
        copyStudioProperties(result);
        result.module=function(module2){
          return _Studio.module(moduleName+'/'+module2);
        };
        result._moduleName = moduleName;
        result.service = function(options,extra){
            if(!options.id && !options.name) throw exception.ServiceNameOrIdNotFoundException();
            options.id = options.id || options.name;
            options.id = moduleName+'/'+options.id;
            return _Studio.service(options,extra);
        };
        result.ref = function(options,extra){
            return _Studio.ref(moduleName+'/'+options,extra);
        };
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
