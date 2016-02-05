_Promise = require('bluebird');
clone = require('./util/clone');
exceptions = require('./exception');
var listeners = require('./util/listeners');

var _routes ={};
var Router = function Router(){};
Router.prototype.createRoute = function(id,service){
    if(_routes[id]) throw exceptions.RouteAlreadyExistsException(id);
    _routes[id] = listeners.getFirstOnCallListener(id,service);
    return _routes[id];
};
Router.prototype.deleteRoute = function(id){
    return delete _routes[id];
};

Router.prototype.send = function(sender,receiver){
    var params = [].slice.call(arguments,2);
    var route = _routes[receiver];
    if(route){
        var _message = clone({
            sender: sender,
            receiver: receiver,
            body: params
        });
        return route.call(route,_message);
    }else{
        return _Promise.reject(exceptions.RouteNotFoundException(receiver));
    }
};

module.exports = new Router();
