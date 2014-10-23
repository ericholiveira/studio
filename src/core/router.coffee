Timer = require('./util/timer')
Q = require('q')
class Router
  routes :{}
  filters :[]
  registerActor: (actor) ->
    @routes[actor.id]= {actor:actor}
  registerFilter: (regex,filter) ->
    @filters.push({regex:regex,filter:filter})
    for id of @routes when regex.test(id)
      do (id)->
        addFilterToRoute(id,filter)
  addFilterToRoute:(id,filter)->
    @routes[id]?.filter = filter
  sendMessage: (sender,receiver,message)->
    defer = Q.defer()
    route = @routes[receiver]
    Timer.enqueue(()->
      try
        for filter in route.filters
          do (filter)->
            message = filter.filter(message,sender)
        result=route.actor.process(message,sender)
        if result and Q.isPromiseAlike(result) then result.then(defer.resolve).catch(defer.reject) else defer.resolve(result)
      catch err
        defer.reject(err)
    )
    defer.promise
module.exports = new Router()
