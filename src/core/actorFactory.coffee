Actor = require('./actor')
router = require('./router')
Q = require('q')

interceptors=[]
actors = []
proxies=[]
# Responsible for create and manage an actor lifecycle.
class ActorFactory extends Actor
  #Creates a new Actor
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique) when you instantiate an actor you automatically create a stream on the router with this id
  # @option options [Function] process the process function which will be executed for every message
  # @option options [Function] initialize function called after actor creation (optional)
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

#Responsible for intercept actor calls
class InterceptorFactory  extends Actor
  #Creates a new interceptor
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique) when you instantiate an actor you automatically create a stream on the router with this id
  # @option options [Function] process the process function which will be executed for every message
  # @option options [Class] clazz Actor class (optional)
  # @option options [Function] initialize function called after actor creation (optional)
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
