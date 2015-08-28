# Namespace
Actor = require('./actor')
Driver = require('./driver')
Studio= {
  router: require('./router'),
  Actor: require('./actor'),
  Driver: require('./driver'),
  Promise: require('bluebird'),
  Bacon: require('baconjs'),
  # Constructs a new driver and automatically starts it
  # On the example with express, you can see that all you have to do is to wraps the message on the `to` function and deal with the promise result
  # (in this case, put the actor response on response body)
  # Returns a function which automatically calls driver.send when executed, you can also directly access the driver using driverFactoryReturn.driver
  # @param [Function] this function receives as the first parameter a function to be called with the message value, and the parameters to build the message
  # @param [Object] clazz (optional) a class to instantiate the driver, if none, use Studio.Driver
  # @example How to instantiate an driver (with driver factory , using express)
  #   app.get('/', Studio.driverFactory(function(to,req,res){
  #      to({sender: null,receiver: 'hello',body: req.body,headers: null}).then(res.send.bind(res));
  #    }
  driverFactory:(execute, clazz = Driver)->
    _message = {value:null}
    driver = new clazz({parser:()->_message.value})
    driverFunction = (args...) ->execute((message)->
      _message.value = message
      driver.send(args...)
    ,args...)
    driverFunction.driver = driver
    driverFunction
  # Constructs a new actor and automatically starts it
  # @param [Object] options can be a named function "function dummy(){}" or an object with a key and value "{dummy:function(){}}"
  # if its a named function the id of the created object is the name of the function and the function will be used as the process function
  # if its an object, the key is going to be the actor id and the value the process function
  # @param [Object] clazz (optional) a class to instantiate the actor, if none, use Studio.Actor
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
