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
        var params = [].slice.call(arguments);
        var message = clone(params);
        var route = _routes[receiver];
        if(route){
            return route.fn.apply(route,message);
        }
        return _Promise.reject(exceptions.RouteNotFoundException(params[params.length-1]));
    };
};

module.exports = new Router();
