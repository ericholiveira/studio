Timer = require('./util/timer')
Q = require('q')
Bacon = require('baconjs')
clone = require('./util/clone')

_routes ={}
# Base class for Router (is singleton, should not be reimplemented nor reinstantiated, and probably not direct accessed).
class Router
  # Constructs a new Router
  constructor: () ->
  # Creates a route, if it already exists return this route
  # @param [String] id the route identification
  # @example How create or get a route
  #   router.createOrGetRoute('myActor')
  createOrGetRoute: (id) ->
    if not _routes[id]
      stream = new Bacon.Bus()
      _routes[id] = {stream:stream}
    _routes[id].stream
  # Returns a route
  # @param [String] id the route identification
  # @example How to get a route
  #   router.getRoute('myActor')
  getRoute:(id) -> _routes[id]
  # sends a message to the receivers
  # @param [String] sender the sender identification
  # @param [String] receiver the receiver route identification
  # @param [Object] message the message to be delivered
  # @example How to send a string(or any primitive) message
  #   router.send('mySenderActor','myReceiverActor', 'HELLO WORLD')
  # @example How to send an object message
  #   router.send('mySenderActor','myReceiverActor', {hello:'hello',
  #                                  obj:{
  #                                    count:1
  #                                  }
  #                                })
  send: (sender,receiver,message)->
    defer = Q.defer()
    route = _routes[receiver]
    _message = {
      sender:sender
      receiver:receiver
      body:message
      callback:(err,result)-> if err then defer.reject(err) else defer.resolve(result)
      }
    Timer.enqueue(()->
      route.stream.push(_message)
    )
    defer.promise
  # Retrieves all defined routes for this router
  getAllRoutes:()->
    route for route of _routes
module.exports = new Router()
