module.exports = function(options){
    "use strict";
    options.onStart(function(serv,ref){
        ref.retry = function(retryCount,filter){
            var _fn = serv.fn;
            retryCount = +retryCount || 0;
            filter = filter || function(){return true;};
            serv.fn = function(){
                var body = arguments;
                var call = function(retries){
                    return _fn.apply(serv,body).catch(function(error){
                        if(retries > 0 && filter(error)){
                            return call(retries -1);
                        }else{
                            throw e;
                        }
                    });
                };
                return call(retryCount);
            };
            return ref;
        };
    });
};
