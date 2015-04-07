
router = require('./router')
BaseClass = require('./util/baseClass')
Promise = require('bluebird')
Bacon = require('baconjs')
clone = require('./util/clone')
ArrayUtil = require('./util/arrayUtil')
fs = require('fs')


# Base class for all actors.
class Actor extends BaseClass

  # Constructs a new actor and automatically starts it
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique) when you instantiate an actor you automatically create a stream on the router with this id
  # @option options [Function] process the process function which will be executed for every message
  # @option options [Function] initialize function called after actor creation (optional)
  # @example How to instantiate an actor (in javascript)
  #   var myActor = new Actor({
  #               id: 'myActor',
  #               process:function(body,headers,sender,receiver){ console.log(body);}
  #             });
  # @example How to instantiate an actor (in Coffescript)
  #   myActor = new Actor({
  #               id: 'myActor',
  #               process:(body,sender,receiver)-> console.log(body)
  #             })
  constructor: (options) ->
    @[property] = options[property] for property of options
    throw new Error('You must provide an id') if not @id
    throw new Error('You must provide a process function') if not @process
    @stream = router.createOrGetRoute(@id)
    if typeof @filter == 'function'
      @stream = @stream.flatMap((message)=>
        try
          {sender,body,receiver,callback,headers} = message
          result = @filter(body,headers,sender,receiver)
          if result instanceof Promise
            Bacon.fromPromise(result.then((result)->
              if result
                message
              else
                throw new Error('Filtered message')
              ).catch((error)->
              message.callback(error)
              false
              )).filter((message)->message!=false)
          else
            if result
              Bacon.once(message)
            else
              message.callback(new Error('Filtered message'))
              Bacon.never()
        catch err
          message.callback(err)
          Bacon.never()
    )
    @unsubscribe = @stream.onValue((message)=>@_doProcess(message))
    if options.watchPath
      watch = options.watchPath
      watcher = fs.watch(watch,()=>
        watcher.close()
        delete require.cache[watch]
        router.deleteRoute(@id)
        require(watch)
      )
    @initialize?(options)
  # PRIVATE METHOD SHOULD NOT BE CALLED
  # Takes a stream message and open it for the actor process function format. And creates a promise with the result of the message
  _doProcess:(message) =>
    __doProcess=(message) =>
      {sender,body,receiver,callback,headers} = message
      try
        result = @process(body,headers,sender,receiver)
        if result instanceof Promise
          result.then((result)->
            callback(undefined,result)
          ).catch((err)->
            callback(err or new Error('Unexpected Error'))
          )
        else
          callback(undefined,result)
      catch err
        callback(err or new Error('Unexpected Error'))
    if message?.length
      __doProcess(_message) for _message in message
      return
    else
      __doProcess(message)
      return
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
  # @param [Object] headers headers for the message (optional)
  # @example How to send a string message
  #   myActor.send('otherActor', 'myMessage')
  # @example How to send an object message
  #   myActor.send('otherActor', {hello:'hello',
  #                                  obj:{
  #                                    count:1
  #                                  }
  #                                })
  send: (receiver,message,headers={})->
    router.send(@id,receiver,message,headers).bind(@)
  # Returns a function with receiver and headers binded
  # @param [String] receiver the receiver id
  # @param [Object] headers headers for the message (optional)
  # @example How to send a string message using bindSend
  #   myActor.bindSend('otherActor')('myMessage')
  # @example How to send an object (with headers) message using bind
  #   myActor.bindSend('otherActor',{userId:1} )({hello:'hello',
  #                                  obj:{
  #                                    count:1
  #                                  }
  #                                })
  bindSend:(receiver,headers)->
    sendMessage = (message,_headers)=>@send(receiver,message,headers or _headers)
    sendMessage.withHeader = (header)=> @bindSend(receiver,header)
    sendMessage
  # attach a named route as a function.
  # So if you use this.attachRoute('someRoute'), you can use this.someRoute(someMessage)
  # which is equivalent to this.send('someRoute',someMessage)
  # if the platform already had implemented Proxy, it return a proxy for all routes
  # @param [Object] routePattern optional , it can be a string, an array of routes to be attached or a regular expression of routes
  # with no arguments mapRoute returns all routes
  # @example How to map routes
  #   myActor.mapRoute('someRoute');
  #   myActor.mapRoute(['someRoute1','someRoute2']);
  #   myActor.mapRoute(/some/g);
  #   myActor.mapRoute();
  mapRoute:(routePattern)->
    that = @
    container={}
    _mapRouteWithProxy = ()->
      return Proxy.create({
        get:(target,name)->(message)->that.send(name,message)
        })
    if Proxy? and typeof Proxy.create =='function'
      _mapRouteWithProxy()
    else
      if not routePattern?
        allRoutes = router.getAllRoutes()
        for route in allRoutes
          container[route] = @bindSend(route)
      else if routePattern instanceof RegExp
        allRoutes = router.getAllRoutes()
        for route in allRoutes when routePattern.test(route)
          container[route] = @bindSend(route)
      else if ArrayUtil.isArray(routePattern)
        for route in routePattern
          container[route] = @bindSend(route)
      else
        container[routePattern] = @bindSend(routePattern)
      container
  # Stop an actor
  # @example How to stop an actor
  #   myActor.stop();
  stop:()->
    @_process = @process
    @process = ()-> throw new Error('Stopped')
  # Start an actor (an actor is automatically started on instantiation)
  # @example How to start an actor
  #   myActor.start();
  start:()->
    @process = @_process or @process
  # Returns the actor id
  toString:()->
    @id
  # Empty initializer
  initialize:()->
module.exports = Actor
