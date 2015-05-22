# Namespace
Studio={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  Promise:require('bluebird'),
  Bacon:require('baconjs'),
  use : (plugin)->
    plugin({
      routerSend:Studio.router.send.bind(Studio.router),
      listenTo:{
        onCreateActor:(listener)-> require('./util/listeners').addOnCreateActor(listener)
        onDestroyActor:()-> require('./util/listeners').addOnDestroyActor(listener)
        onCreateDriver:()-> require('./util/listeners').addOnCreateDriver(listener)
        onDestroyDriver:()-> require('./util/listeners').addOnDestroyDriver(listener)
      }
    })
}
module.exports=Studio
