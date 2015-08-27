# Namespace
Actor = require('./actor')
Studio={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  Promise:require('bluebird'),
  Bacon:require('baconjs'),
  # Constructs a new actor and automatically starts it
  # @param [Object] options can be a named function "function dummy(){}" or an object with a key and value "{dummy:function(){}}"
  # if its a named function the id of the created object is the name of the function and the function will be used as the process function
  # if its an object, the key is going to be the actor id and the value the process function
  # @example How to instantiate an actor (with actor factory)
  #   var myActor = Studio.actorFactory({myActor:function(body,headers,sender,receiver){ console.log(body);}});
  #   var other = Studio.actorFactory(function other(body,headers,sender,receiver){ console.log(body);});
  actorFactory:(options,clazz=Actor)->
    act={}
    if typeof options == 'function' and options.name
      act.id = options.name
      act.process = options
    else
      id = Object.keys(options)[0]
      act.id = id
      act.process = options[id]
    new clazz(act)
  #Plugin
  use : (plugin)->
    plugin({
      interceptSend:(funk)->
        _send = Studio.router.send
        Studio.router.send = funk(_send.bind(Studio.router))
      listenTo:{
        onCreateActor:(listener)-> require('./util/listeners').addOnCreateActor(listener)
        onDestroyActor:(listener)-> require('./util/listeners').addOnDestroyActor(listener)
        onCreateDriver:(listener)-> require('./util/listeners').addOnCreateDriver(listener)
        onDestroyDriver:(listener)-> require('./util/listeners').addOnDestroyDriver(listener)
      }
    },Studio)
}
module.exports=Studio
