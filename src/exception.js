var util = require('util');
function StudioException(){}
util.inherits(StudioException,Error);

function RouteNotFoundException (route){
  "use strict";
    if(!(this instanceof RouteNotFoundException)){
        return new RouteNotFoundException(route);
    }
    this.name = 'ROUTE_NOT_FOUND';
    this.route = route;
    this.message = "The route "+route+" doesnt exists";
}
util.inherits(RouteNotFoundException,StudioException);

function RouteAlreadyExistsException (route){
  "use strict";
    if(!(this instanceof RouteAlreadyExistsException)){
        return new RouteAlreadyExistsException(route);
    }
    this.name = 'ROUTE_ALREADY_EXISTS';
    this.route = route;
    this.message = "The route "+route+" already exists";
}
util.inherits(RouteNotFoundException,StudioException);

function ServiceNameOrIdNotFoundException (){
  "use strict";
    if(!(this instanceof ServiceNameOrIdNotFoundException)){
        return new ServiceNameOrIdNotFoundException();
    }
    this.name = 'SERVICE_NAME_OR_ID_NOT_FOUND';
    this.message = "You must provide an unique name or id for the service";
}
util.inherits(ServiceNameOrIdNotFoundException,StudioException);

function ServiceFunctionNotFoundException (){
  "use strict";
    if(!(this instanceof ServiceFunctionNotFoundException)){
        return new ServiceFunctionNotFoundException();
    }
    this.name = 'SERVICE_FUNCTION_NOT_FOUND';
    this.message = "You must provide a function for the service";
}
util.inherits(ServiceFunctionNotFoundException,StudioException);

function FilteredMessageException (receiver){
  "use strict";
    if(!(this instanceof FilteredMessageException)){
        return new FilteredMessageException(receiver);
    }
    this.name = 'FILTERED_MESSAGE';
    this.receiver = receiver;
    this.message = receiver+" filtered a message";
}
util.inherits(FilteredMessageException,StudioException);

module.exports={
    RouteNotFoundException:RouteNotFoundException,
    FilteredMessageException:FilteredMessageException,
    RouteAlreadyExistsException:RouteAlreadyExistsException,
    ServiceNameOrIdNotFoundException:ServiceNameOrIdNotFoundException,
    ServiceFunctionNotFoundException:ServiceFunctionNotFoundException,
};
