class StudioException extends Error
  constructor:(@code,@message)->

class RouteNotFoundException extends StudioException
  constructor:(@route)->
    return new RouteNotFoundException(@route) unless @ instanceof RouteNotFoundException
    super('ROUTE_NOT_FOUND',"The route #{@route} doesnt exists")

class RouteAlreadyExistsException extends StudioException
  constructor:(@route)->
    return new RouteAlreadyExistsException(@route) unless @ instanceof RouteAlreadyExistsException
    super('ROUTE_ALREADY_EXISTS',"The route #{@route} already exists")

class FilteredMessageException extends StudioException
  constructor:(@receiver)->
    return new FilteredMessageException(@receiver) unless @ instanceof FilteredMessageException
    super('FILTERED_MESSAGE',"#{@receiver} filtered a message")

class TimeoutException extends StudioException
  constructor:(@sender, @receiver)->
    return new TimeoutException(@sender, @receiver) unless @ instanceof TimeoutException
    super('TIMEOUT',"Timeout from #{@sender} to #{@receiver}")

module.exports={StudioException,RouteNotFoundException,FilteredMessageException,TimeoutException,RouteAlreadyExistsException}
