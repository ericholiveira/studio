# Namespace
Studio={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  Promise:require('bluebird'),
  Bacon:require('baconjs'),
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
