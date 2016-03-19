var _Promise = require('bluebird');
var generatorUtil = require('./generator');
var listeners = {
    onStart:[],
    onStop:[],
    interceptSend:[]
};
var handleFilter = function(opt){
    "use strict";
    var helper;
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
};
var addListener=function(type, listener,module){
  "use strict";
    var opt={};
    opt.filter = listener.filter;
    opt.fn = generatorUtil.toAsync(listener.fn);
    handleFilter(opt);
    module = module ? module+'/' : '';
    opt.module = module;
    listeners[type].push(opt);
    return listeners[type];
};
var notify = function(type, target){
  "use strict";
    var i,len;
    var _listeners = listeners[type];
    for(i=0,len=_listeners.length;i<len;i++){
        if(_listeners[i].filter(target.id) && target.id.indexOf(_listeners[i].module)===0){
            _listeners[i].fn(target,target.__plugin_info.ref);
        }
    }
    return target;
};
module.exports={
    addOnStartListener:function(listener,filter,module){
      "use strict";
        return addListener('onStart',{fn:listener,filter:filter},module);
    },
    addOnStopListener:function(listener,filter,module){
      "use strict";
        return addListener('onStop',{fn:listener,filter:filter},module);
    },
    notifyStart:function(target){
      "use strict";
        return notify('onStart',target);
    },
    notifyStop:function(target){
      "use strict";
        return notify('onStop',target);
    },
    addInterceptSend:function(listener,filter,module) {
        "use strict";
        var opt={filter:filter};
        handleFilter(opt);
        opt.fn = listener;
        module = module ? module+'/' : '';
        opt.module = module;
        listeners.interceptSend.push(opt);
    },
    getInterceptSendForRoute:function(send,route){
        var i,len;
        var _listeners = listeners.interceptSend;
        for(i=0,len=_listeners.length;i<len;i++){
            if(_listeners[i].filter(route) && route.indexOf(_listeners[i].module)===0){
                send = _listeners[i].fn(send,route);
            }
        }
        return send;
    }
};
