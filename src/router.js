_Promise = require('bluebird');
clone = require('./util/clone');
exceptions = require('./exception');

var _routes ={};
var Router = function Router(){};
Router.prototype.createRoute = function(name,service){
    if(_routes[name]) throw exceptions.RouteAlreadyExistsException(id);
    _routes[name] = service;
    return _routes[name];
};
Router.prototype.deleteRoute = function(){
    return delete _routes[id];
};
/*Router.prototype.getRoute = function(id){
    return _routes[id];
};*/
Router.prototype.send = function(sender,receiver){
    var params = [].slice.call(arguments,2);
    var route = _routes[receiver];
    if(route){
        var _message = {
            sender: sender,
            receiver: receiver,
            body: params
        };
        return route.call(route,clone(_message));
    }else{
        return _Promise.reject(exceptions.RouteNotFoundException(receiver));
    }
};
Router.prototype.getAllRoutes = function(){
    return Object.keys(_routes);
};

module.exports = new Router();
