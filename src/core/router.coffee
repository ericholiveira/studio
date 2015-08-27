_Promise = require('bluebird')
Bacon = require('baconjs')
clone = require('./util/clone')
StudioStream = require('./util/studioStream')

_routes ={}
# Base class for Router (is singleton, should not be reimplemented nor reinstantiated, and probably not direct accessed).
class Router
  # Constructs a new Router
  constructor: () ->
  # Creates a route, if it already exists throws exception
  # @param [String] id the route identification
  # @example How create or get a route
  #   router.createRoute('myActor')
  createRoute: (id,watchPath) ->
    if _routes[id]
      throw new Error('Route already exists')
    stream = new StudioStream()
    _routes[id] = {stream:stream}
    _routes[id].stream
  # Removes a route (BE CAREFUL)
  # @param [String] id the route identification
  # @example How to delete a route
  #   router.deleteRoute('myActor')
  deleteRoute:(id)-> delete _routes[id]
  # Returns a route
  # @param [String] id the route identification
  # @example How to get a route
  #   router.getRoute('myActor')
  getRoute:(id) -> _routes[id]
  # sends a message to the receivers
  # @param [String] sender the sender identification
  # @param [String] receiver the receiver route identification
  # @param [Object] message the message to be delivered
  # @param [Object] headers headers for the message (optional)
  # @example How to send a string(or any primitive) message
  #   router.send('mySenderActor','myReceiverActor', 'HELLO WORLD')
  # @example How to send an object message
  #   router.send('mySenderActor','myReceiverActor', {hello:'hello',
  #                                  obj:{
  #                                    count:1
  #                                  }
  #                                })
  send: (sender,receiver,message,headers)->
    new _Promise((resolve,reject)->
      route = _routes[receiver]
      _message = {
        sender:sender
        receiver:receiver
        body:message
        headers:headers
        callback:(err,result)-> if err then reject(err) else resolve(result)
        }
      if route?
        route.stream.push(clone(_message))
      else
        reject(new Error("The route #{receiver} doesn't exists"))
      )
  # Retrieves all defined routes for this router
  getAllRoutes:()->
    route for route of _routes
module.exports = new Router()
