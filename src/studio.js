var Studio= {
    router: require('./router'),
    service: require('./service'),
    promise: require('bluebird'),
    exception: require('./exception'),
    /*use : (plugin)->
        plugin({
            interceptSend:(funk)->
                _send = Studio.router.send
                Studio.router.send = funk(_send.bind(Studio.router))
            listenTo:{
                onCreateActor:(listener)-> require('./util/listeners').addOnCreateActor(listener)
                onDestroyActor:(listener)-> require('./util/listeners').addOnDestroyActor(listener)
                onCreateDriver:(listener)-> require('./util/listeners').addOnCreateDriver(listener)
                onDestroyDriver:(listener)-> require('./util/listeners').addOnDestroyDriver(listener)
}       },Studio)*/
    ref : require('./ref')

};
module.exports=Studio;
