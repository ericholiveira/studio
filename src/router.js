_Promise = require('bluebird');
clone = require('./util/clone');
exceptions = require('./exception');
var listeners = require('./util/listeners');

var _routes ={};
var Router = function Router(){};
Router.prototype.createRoute = function(id,service){
    if(_routes[id]) throw exceptions.RouteAlreadyExistsException(id);
    _routes[id] = service;
    return _routes[id];
};
Router.prototype.deleteRoute = function(id){
   _routes[id] = null;
};

Router.prototype.send = function(receiver){
    return function(){
      var route = _routes[receiver];
      if(!route){
        return _Promise.reject(exceptions.RouteNotFoundException(arguments[arguments.length -1]));
      }
      switch(arguments.length){
          case 0: 
            return route.fn();
          case 1:
            return route.fn(clone(arguments[0]));
          case 2:
            return route.fn(clone(arguments[0]),clone(arguments[1]));
          default: 
            return route.fn.apply(route,clone([].slice.call(arguments)));
        }
    };
};

module.exports = new Router();
