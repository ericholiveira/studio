var util = require('util');
function StudioException(){}
util.inherits(StudioException,Error);

function RouteNotFoundException (route){
    if(!this instanceof RouteNotFoundException){
        return new RouteNotFoundException(route);
    }
    this.code = 'ROUTE_NOT_FOUND';
    this.route = route;
    this.message = "The route "+route+" doesnt exists";
}
util.inherits(RouteNotFoundException,StudioException);

function RouteAlreadyExistsException (route){
    if(!this instanceof RouteAlreadyExistsException){
        return new RouteAlreadyExistsException(route);
    }
    this.code = 'ROUTE_ALREADY_EXISTS';
    this.route = route;
    this.message = "The route "+route+" already exists";
}
util.inherits(RouteNotFoundException,StudioException);

function FilteredMessageException (receiver){
    if(!this instanceof FilteredMessageException){
        return new FilteredMessageException(receiver);
    }
    this.code = 'FILTERED_MESSAGE';
    this.receiver = receiver;
    this.message = receiver+" filtered a message";
}
util.inherits(FilteredMessageException,StudioException);

function TimeoutException (sender,receiver){
    if(!this instanceof TimeoutException){
        return new TimeoutException(sender,receiver);
    }
    this.code = 'TIMEOUT';
    this.receiver = receiver;
    this.sender = sender;
    this.message = "Timeout on message from "+sender+" to "+receiver;
}
util.inherits(FilteredMessageException,StudioException);

module.exports={
    StudioException:StudioException,
    RouteNotFoundException:RouteNotFoundException,
    FilteredMessageException:FilteredMessageException,
    TimeoutException:TimeoutException,
    RouteAlreadyExistsException:RouteAlreadyExistsException
};
