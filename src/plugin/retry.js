module.exports = function(defaultOptions){
    "use strict";
    defaultOptions = defaultOptions || {};
    return function(options,Studio){
        options.onStart(function(serv,ref){
            ref.retry = function(localOptions){
                var _fn = serv.fn;
                localOptions = localOptions || {};
                var filter = localOptions.filter || defaultOptions.filter || function(){return true;};
                var retryCount = +(localOptions.max || defaultOptions.max || 0);
                var initialInterval = +(localOptions.initialInterval || defaultOptions.initialInterval || 0);
                var factor = +(localOptions.factor || defaultOptions.factor || 1);
                filter = filter || function(){return true;};
                serv.fn = function(){
                    var body = arguments;
                    var call = function(retries,interval){
                        return _fn.apply(serv,body).catch(function(error){
                            if(retries > 0 && filter(error)){
                                return new Studio.promise.delay(interval).then(function(){
                                    return call(retries -1, interval*factor);
                                });
                            }else{
                                throw e;
                            }
                        });
                    };
                    return call(retryCount,initialInterval);
                };
                return ref;
            };
        });
    };
};



