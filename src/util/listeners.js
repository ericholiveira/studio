var _Promise = require('bluebird');
var isGeneratorFunction = require('./generator').isGeneratorFunction;
var listeners = {
    onStart:[],
    onStop:[]
};
var addListener=function(type, listener){
    var opt={},helper;
    opt.filter = listener.filter;
    if(isGeneratorFunction(listener.fn)){
        opt.fn = _Promise.coroutine(listener.fn);
    }else{
        opt.fn = _Promise.method(listener.fn);
    }
    if(!opt.filter){
        opt.filter = function(){
            return true;
        };
    }else if(opt.filter instanceof RegExp){
        helper = opt.filter;
        opt.filter = function(route){
            return helper.test(route);
        };
    }else if(Array.isArray(opt.filter)){
        helper = opt.filter;
        opt.filter = function(route){
            var i= 0,_len = helper.length,res = false;
            for(;i<_len;i++){
                res = res || (helper[i]===route);
            }
            return res;
        };
    }else if(typeof opt.filter !== 'function'){
        helper = opt.filter;
        opt.filter = function(route){
            return helper === route;
        };
    }
    listeners[type].push(opt);
    return listeners[type];
};
var notify = function(type, target){
    var i,len;
    var _listeners = listeners[type];
    for(i=0,len=_listeners.length;i<len;i++){
        if(_listeners[i].filter(target.id)){
            _listeners[i].fn(target,target.__plugin_info.ref);
        }
    }
    return target;
};
module.exports={
    addOnStartListener:function(listener,filter){
        return addListener('onStart',{fn:listener,filter:filter});
    },
    addOnStopListener:function(listener,filter){
        return addListener('onStop',{fn:listener,filter:filter});
    },
    notifyStart:function(target){
        return notify('onStart',target);
    },
    notifyStop:function(target){
        return notify('onStop',target);
    }
};