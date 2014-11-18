Actor = require('./actor')
router = require('./router')

interceptors=[]
# Responsible for create and manage an actor lifecycle.
class ActorFactory extends Actor
  process:(options)->
    options.clazz = options.clazz or Actor
    process = (body,sender,receiver)->
      toCallInterceptors = interceptor.interceptor for interceptor in interceptors when interceptor.route[receiver]
      message = {body,sender,receiver}
      produceNext = (index,message)->
        if index==toCallInterceptors.length-1
          ()-> router.send(sender,"#{receiver}__original",body)
        else
          nextRoute = toCallInterceptors[index+1].route
          ()->
            message.next = produceNext(index+1,message)
            router.send(sender,nextRoute,message)
      if toCallInterceptors.length==0
        router.send(sender,"#{receiver}__original",body)
      else
        message.next=produceNext(0,message)
        router.send(sender,toCallInterceptors[0].route,message)
    proxy = new Actor({id,route,process})
    options.id="#{options.id}__original"
    options.route="#{options.route}__original"
    new clazz(options)

class InterceptorFactory  extends Actor
  process:(options)->
    interceptors.push({
      interceptor:options.interceptor
      route:@mapRoute(options.routes)
    })
module.exports ={
  actorFactory:new ActorFactory({
    id:'__actorFactorySingleton',
    route:'createActor'
  }),
  interceptorFactory:new InterceptorFactory({
    id:'__interceptorFactorySingleton',
    route:'interceptRoute'
  })
}
