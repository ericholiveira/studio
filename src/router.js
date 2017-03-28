_Promise = require('bluebird');
clone = require('./util/clone');
exceptions = require('./exception');
var logging= require('./logging');
var listeners = require('./util/listeners');

var _routes ={};
var _sends={};
var Router = function Router(){};
Router.prototype.createRoute = function(id,service){
  "use strict";
    if(_routes[id]) throw exceptions.RouteAlreadyExistsException(id);
    _routes[id] = service;
    return _routes[id];
};
Router.prototype.deleteRoute = function(id){
  "use strict";
   _routes[id] = null;
};

Router.prototype.send = function(rec){
    "use strict";
    logging.instance.log('Routing: send to ' + rec);
    if(!_sends[rec]){
        _sends[rec] = function(){
            var rt = _routes[rec];
            if(!rt){
                return _Promise.reject(exceptions.RouteNotFoundException(rec));
            }
            switch(arguments.length){
                case 0:
                    return rt.fn();
                case 1:
                    return rt.fn(clone(arguments[0]));
                case 2:
                    return rt.fn(clone(arguments[0]),clone(arguments[1]));
                default:
                    return rt.fn.apply(rt,clone([].slice.call(arguments)));
            }
        };
        _sends[rec] = listeners.getInterceptSendForRoute(_sends[rec],rec);
    }
    return _sends[rec];
};

module.exports = new Router();
