
router = require('./router')
BaseClass = require('./util/baseClass')
Q = require('q')
clone = require('./util/clone')
ArrayUtil = require('./util/arrayUtil')


# Base class for all actors.
class Actor extends BaseClass

  # Constructs a new actor and automatically starts it
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique)
  # @option options [String] route when you instantiate an actor you automatically create a stream on the router with this route, multiple actors can share the same route topic/queue
  # @option options [Function] process the process function which will be executed for every message
  # @option options [Function] initialize function called after actor creation (optional)
  # @example How to instantiate an actor (in javascript)
  #   var myActor = new Actor({
  #               id: 'myActor',
  #               process:function(body,sender,receiver){ console.log(body);},
  #               route : 'myPipe'
  #             });
  # @example How to instantiate an actor (in Coffescript)
  #   myActor = new Actor({
  #               id: 'myActor',
  #               process:(body,sender,receiver)-> console.log(body),
  #               route : 'myPipe'
  #             })
  constructor: (options) ->
    @[property] = options[property] for property of options
    throw new Error('You must provide an id') if not @id
    throw new Error('You must provide a process function') if not @process
    throw new Error('You must provide a route') if not @route
    @stream = router.createOrGetRoute(@route).map((message)->clone(message))
    @unsubscribe = @stream.onValue(@_doProcess)
    @initialize?(options)
  # PRIVATE METHOD SHOULD NOT BE CALLED
  # Takes a stream message and open it for the actor process function format. And creates a promise with the result of the message
  _doProcess:(message) =>
    __doProcess=(message) =>
      {sender,body,receiver,callback} = message
      try
        result=@process(body,sender,receiver)
        if result and Q.isPromiseAlike(result)
          result.then((result)->callback(undefined,result)).catch((err)->
            callback(err or new Error('Unexpected Error'))
          )
        else
          callback(undefined,result)
      catch err
        callback(err)
    if message?.length
      __doProcess(_message) for _message in message
    else
      __doProcess(message)
  # Transform the message stream, so you can merge other streams, filter, buffer or do anything you can do with a baconjs stream
  # @param [Function] funktion a function which receives the current stream for this actor and return the new transformed stream
  # @example How to apply a filter transformation (in javascript)
  #   myActor.addTransformation(function(stream){return stream.filter(function(message){return message.sender == 'otherActor';});});
  # @example How to apply a filter transformation (in Coffescript)
  #   myActor.addTransformation((stream)->stream.filter((message)->message.sender == 'otherActor'))
  addTransformation:(funktion)->
    @unsubscribe()
    @stream = funktion(@stream)
    @unsubscribe = @stream.onValue(@_doProcess)
  # Sends message to an actor
  # @param [String] receiver the receiver id
  # @param [Object] message the content of the message (it could be any js object)
  # @example How to send a string message
  #   myActor.send('otherActor', 'myMessage')
  # @example How to send an object message
  #   myActor.send('otherActor', {hello:'hello',
  #                                  obj:{
  #                                    count:1
  #                                  }
  #                                })
  send: (receiver,message)->
    router.send(@id,receiver,message)
  # attach a named route as a function.
  # So if you use this.attachRoute('someRoute'), you can use this.someRoute(someMessage)
  # which is equivalent to this.send('someRoute',someMessage)
  # @param [Object] routePattern it can be a string, an array of routes to be attached or a regular expression of routes
  # @example How to map routes
  #   myActor.attachRoute('someRoute');
  #   myActor.attachRoute(['someRoute1','someRoute2']);
  #   myActor.attachRoute(/some/g);
  mapRoute:(routePattern)->
    container={}
    if routePattern instanceof RegExp
      allRoutes = router.getAllRoutes()
      for route in allRoutes when routePattern.test(route)
        container[route] = (message)=>@send(route,message)
    else if ArrayUtil.isArray(routePattern)
      for route in routePattern
        container[route] = (message)=>@send(route,message)
    else
      container[routePattern] = (message)=>@send(routePattern,message)
    container
  # Stop an actor
  # @example How to apply a filter transformation
  #   myActor.stop();
  stop:()->
    @_process = @process
    @process = ()-> throw new Error('Stopped')
  # Start an actor (an actor is automatically started on instantiation)
  # @example How to apply a filter transformation
  #   myActor.stop();
  start:()->
    @process = @_process or @process
module.exports = Actor
