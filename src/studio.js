var key;
var exception= require('./exception');
var logging= require('./logging');
var isGeneratorFunction = require('./util/generator').isGeneratorFunction;
/** 
    @module Studio
    This is the main object exposing all Studio methods
*/
var _Studio= {
    /** Studio internal router, avoid usage*/
    router: require('./router'),
    /** @function
    * @name service
    * @desc Creates a service from a named function . Or from a object with parameters id and fn
    * @param {function} fn. The service
    * @example
    * Studio.service(function myService(){
    *    // DO SOMETHING
    * });//Creates a service called myService
    * Studio.service({
    *   id:'myOtherService',
    *   fn:function (){
    *       // DO SOMETHING
    *   }
    * });//Creates a service called myOtherService
    * Studio(function yetAnotherService(){
    *    // DO SOMETHING
    * });// Studio(SOME_FUNCTION) and Studio(SOME_OBJECT) is a shortcut for Studio.service
    */
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
    /** @function
    * @name module
    * @desc Creates (or retrieves if it already exists) a module. 
    * Should be used to avoid service name conflict for large systems.
    * The module created have all the same methods and properties of Studio object, but running inside of that namespace.
    * @param {String} moduleName. The module name
    * @return {function} Studio. A function with all methods and properties fo Studio
    * @example
    * var fooModule = Studio.module('foo'); // Create or retrieves a module
    * var barModule = Studio.module('bar'); // Create or retrieves a module
    * // Create a service inside foo module, this service calls a service from bar module
    * fooModule(function fooMethod(){
    *   var barService = barModule('barMethod');
    *   return barservice('Hello');
    * });
    * // Creates a service inside bar module
    * barModule(function barMethod(param){
    *   return param = ' bar';
    * });
    * var fooService = fooModule('fooMethod');//Retrieves fooMethod from foo module
    * fooService().then(function(result){
    *   console.log(result); // Prints Hello bar'
    * });
    */
    module:function(moduleName){
      "use strict";
        logging.instance.log('Created module '+moduleName);
        var result = function(options,extra){
            if(typeof options === 'string'){
                return result.ref(options,extra);
            }
            return result.service(options,extra);
        };
        copyStudioProperties(result);
        result.module=function(module2){
          logging.instance.log('Created module '+moduleName+'/'+module2);
          return _Studio.module(moduleName+'/'+module2);
        };
        result._moduleName = moduleName;
        result.service = function(options,extra){
            if(!options.id && !options.name) {
              logging.instance.error('Throwing error ServiceNameOrIdNotFoundException');
              throw exception.ServiceNameOrIdNotFoundException();
            }
            options.id = options.id || options.name;
            options.id = moduleName+'/'+options.id;
            return _Studio.service(options,extra);
        };
        result.ref = function(options,extra){
            return _Studio.ref(moduleName+'/'+options,extra);
        };
        return result;
    },
    /** @function
    * @name use
    * @desc Enables a plugin
    * @param {function} plugin. The plugin you want to use
    * @param {Object} filter. The filter for this plugin usage
    * @example
    * Studio.use(myPlugin);//Enables myPlugin for all services
    * Studio.use(otherPlugin,'foo'); // Enables otherPlugin only for a service called foo
    * Studio.use(otherPlugin2,/f.+/); // Enables otherPlugin2 only for services which names match the /f.+/ regex
    * Studio.use(otherPlugin3,function(serviceName){
    *   return serviceName.length===3;
    * }); // Enables otherPlugin3 only for services which names satisfies that function
    * Studio.use(otherPlugin4,['foo',/f.+/,function(serviceName){
    *   return serviceName.length===3;
    * }]);// Enables otherPlugin4 only for services which names satisfies ANY filter in the array
    */
    use : function(plugin,filter){
        logging.instance.log('%{nameSpace} use a new plugin');
        var self = this;
        return plugin({
            onStart:function(listener){require('./util/listeners').addOnStartListener(listener,filter,self._moduleName);},
            onStop:function(listener){require('./util/listeners').addOnStopListener(listener,filter,self._moduleName);},
            interceptSend:function(listener){require('./util/listeners').addInterceptSend(listener,filter,self._moduleName);}
        },Studio);
    },
    /** @function
    * @name ref
    * @desc Gets a reference to a service by his name
    * @param {String} name. The service name
    * @example
    * var myServiceRef = Studio.ref('myService');//Returns a reference for a service called myService
    * var otherMyServiceRef = Studio('myService');// Studio(SOME_STRING) is a shortcut for Studio.ref(SOME_STRING)
    */
    ref : require('./ref'),
    /** The core plugins available*/
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
    /** @function
    * @name services
    * @desc Gets a reference for all services available on Studio. 
    * This function is available only if Proxy is enabled (node > 6 or older version with --harmony-proxies flag)
    * @example
    * var allServices = Studio.services();// A reference for all services
    * var myServiceRef = Studio('myService');//Returns a reference for a service called myService
    * var myServiceRefFromProxy = allServices.myService;//a reference for a service called myService
    * // For an object inside a module
    * var fooModule = Studio.module('foo');
    * var barServiceRef = fooModule('bar');
    * var barServiceRefFromProxy = allServices.foo.bar;
    */
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

logging.instance.log('Importing %{nameSpace}');
Studio.use(require('./plugin/filter'));
module.exports=Studio;
