var generatorUtil = require('../util/generator');
var logging= require('../logging');
module.exports = function(defaultOptions){
    "use strict";
    defaultOptions = defaultOptions || {};
    return function(options,Studio){
        var filterNoOp = function(){return true;};
        var noop = function(){};
        logging.instance.log('Plugin: creating plugin retry');
        options.onStart(function(serv,ref){
            logging.instance.log('Plugin: retry instantiation');
            ref.retry = function(localOptions){
                var _fn = serv.fn;
                localOptions = localOptions || {};
                var filter = localOptions.filter || defaultOptions.filter || filterNoOp;
                var retryCount = +(localOptions.max || defaultOptions.max || 0);
                var initialInterval = +(localOptions.initialInterval || defaultOptions.initialInterval || 0);
                var factor = +(localOptions.factor || defaultOptions.factor || 1);
                var beforeCall = generatorUtil.toAsync(localOptions.beforeCall || defaultOptions.beforeCall || noop);
                var afterCall = generatorUtil.toAsync(localOptions.afterCall || defaultOptions.afterCall || noop);
                logging.instance.log('Plugin: retry invocation ' + filter);
                filter = filter || function(){return true;};
                serv.fn = function(){
                    var initialTimestamp = new Date().getTime();
                    var params = Array.prototype.slice.call(arguments);
                    var serviceId = serv.id;
                    var operationInfo = {
                        service:serviceId,
                        params: params,
                        initialTimestamp : initialTimestamp,
                        success:null,
                        error:null,
                        status:'PROCESSING',
                        finalTimestamp:null
                    };
                    var call = function(retries,interval){
                        return _fn.apply(serv,params).catch(function(error){
                            if(retries > 0 && filter(error)){
                                return new Studio.promise.delay(interval).then(function(){
                                    return call(retries -1, interval*factor);
                                });
                            }else{
                                throw error;
                            }
                        });
                    };
                    return beforeCall(operationInfo).then(function(){
                        return  call(retryCount,initialInterval).then(function(result){
                            afterCall({
                                service:serviceId,
                                params: params,
                                initialTimestamp : initialTimestamp,
                                success:result,
                                error:null,
                                status:'SUCCESS',
                                finalTimestamp:new Date().getTime()
                            });
                            return result;
                        }).catch(function(err){
                            afterCall({
                                service:serviceId,
                                params: params,
                                initialTimestamp : initialTimestamp,
                                success:null,
                                error:err,
                                status:'ERROR',
                                finalTimestamp:new Date().getTime()
                            });
                            throw err;
                        });
                    });
                };
                return ref;
            };
        });
    };
};



