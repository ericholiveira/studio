Timer = require('./util/timer')
Q = require('q')
Bacon = require('baconjs')
class Router
  _routes :{
    broadcast:{stream:new Bacon.Bus()}
  }
  _filters :[]
  getOrCreateRoute: (id) ->
    if not @_routes[id]
      stream = new Bacon.Bus()
      stream.plug(@_routes.broadcast.stream)
      @_routes[id] = {stream:stream}
    @_routes[id].stream
  send: (sender,receiver,message)->
    defer = Q.defer()
    route = @_routes[receiver]
    _message = {
      sender:sender
      receiver:receiver
      body:message
      callback:(err,result)->
        if err then defer.reject(err) else defer.resolve(result)
      }
    Timer.enqueue(()->
      route.stream.push(_message)
    )
    defer.promise
module.exports = new Router()
