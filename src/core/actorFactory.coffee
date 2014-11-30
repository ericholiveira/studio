Actor = require('./actor')
router = require('./router')
Q = require('q')

interceptors=[]
actors = []
proxies=[]
# Responsible for create and manage an actor lifecycle.
class ActorFactory extends Actor
  process:(options)->
    options._innerProcess = options.process
    process = (body,sender,receiver)->
      toCallInterceptors=[]
      toCallInterceptors.push(interceptor) for interceptor in interceptors when interceptor.route[receiver]
      message = {body,sender,receiver}
      produceNext = (index,message)=>
        if index==toCallInterceptors.length-1
          ()=> Q.fcall(()=>@_innerProcess(body,sender,receiver))
        else
          nextRoute = toCallInterceptors[index+1].interceptor.id
          ()->
            message.next = produceNext(index+1,message)
            router.send(sender,nextRoute,message)
      if toCallInterceptors.length==0
        Q.fcall(()=>@_innerProcess(body,sender,receiver))
      else
        message.next=produceNext(0,message)
        router.send(sender,toCallInterceptors[0].interceptor.id,message)
    options.process = process
    proxy = new Actor(options)
    proxy


class InterceptorFactory  extends Actor
  process:(options)->
    clazz = options.clazz or Actor
    interceptor = new clazz(options)
    interceptors.push({
      interceptor:interceptor
      route:@mapRoute(options.routes)
    })
    console.log(interceptors)
    interceptor
module.exports ={
  actorFactory:new ActorFactory({
    id:'createActor'
  }),
  interceptorFactory:new InterceptorFactory({
    id:'addInterceptor'
  })
}
