Timer = require('./util/timer')
Q = require('q')
Bacon = require('baconjs')
class Router
  routes :{
    broadcast:{stream:new Bacon.Bus()}
  }
  filters :[]
  registerActor: (actor) ->
    if not @routes[actor.id]
      stream = new Bacon.Bus()
      stream.plug(@routes.broadcast.stream)
      @routes[actor.id] = {stream:stream}
    @addFilterToRoute(actor.id,filter) for filter in @filters when filter.regex.test(actor.id)
    @routes[actor.id].stream
  registerFilter: (regex,filter) ->
    @filters.push({regex:regex,filter:filter})
    @addFilterToRoute(id,filter) for id of @routes when regex.test(id)
  addFilterToRoute:(id,filter)->
    @routes[id]?.filters = @routes[id].filters or []
    @routes[id].filters.push(filter)
  sendMessage: (sender,receiver,message)->
    defer = Q.defer()
    route = @routes[receiver]
    _message = {
      sender:sender
      receiver:receiver
      body:message
      callback:(err,result)->
        if err then defer.reject(err) else defer.resolve(result)
      }
    for filter in route.filters or []
      do(filter) ->
        result = filter.filter(_message)
        _message = result if result?
    Timer.enqueue(()->
      route.stream.push(_message)
    ) if _message isnt false
    defer.promise
module.exports = new Router()
