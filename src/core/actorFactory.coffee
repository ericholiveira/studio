Actor = require('./actor')
router = require('./router')

interceptors=[]
actors = []
proxies=[]
# Responsible for create and manage an actor lifecycle.
class ActorFactory extends Actor
  process:(options)->
    clazz = options.clazz or Actor
    process = (body,sender,receiver)->
      toCallInterceptors=[]
      toCallInterceptors.push(interceptor) for interceptor in interceptors when interceptor.route[receiver]
      message = {body,sender,receiver}
      produceNext = (index,message)->
        if index==toCallInterceptors.length-1
          ()-> router.send(sender,"#{receiver}__original",body)
        else
          nextRoute = toCallInterceptors[index+1].interceptor.id
          ()->
            message.next = produceNext(index+1,message)
            router.send(sender,nextRoute,message)
      if toCallInterceptors.length==0
        router.send(sender,"#{receiver}__original",body)
      else
        message.next=produceNext(0,message)
        router.send(sender,toCallInterceptors[0].interceptor.id,message)
    id= options.id
    proxy = new Actor({id,process})
    options.id="#{options.id}__original"
    actor = new clazz(options)
    proxies.push(proxy)
    actors.push(actor)
    proxy


class InterceptorFactory  extends Actor
  process:(options)->
    clazz = options.clazz or Actor
    interceptor = new clazz(options)
    interceptors.push({
      interceptor:interceptor
      route:@mapRoute(options.routes)
    })
    interceptor
module.exports ={
  actorFactory:new ActorFactory({
    id:'createActor'
  }),
  interceptorFactory:new InterceptorFactory({
    id:'addInterceptor'
  })
}
