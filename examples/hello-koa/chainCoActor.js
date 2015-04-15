//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var co = require('co');
/*
  This example shows the usage of co library to write a cleaner
  code using generators
*/
var chainActorCo = new Studio.Actor({
  id: 'chainActorCo',
  initialize:function(opt){
    /*
      Wrap process function using co library, this way we can use
      yield and write cleaner code with generators
    */
    this.process = co.wrap(opt.process);
  },
  /*
    On this case we define process function as a generator, so we can use yield keyword
  */
  process: function*(body, headers, sender, receiver) {
    var messageToChainActor1 = 'actorCo -> ';
    console.log('Received message to actor = ' + chainActorCo.id);
    /*
      As you can see the called actor (chainActor1) don't need any changes, so we can
      communicate to actors using co or regular (non-co) actors without any changes, i.e.
      we dont have to worry about the implementation of other actors, you can use Co, or any
      generators/promise flow-control lib without any changes on your regular actors
    */
    return yield this.send('chainActor1', messageToChainActor1);
  }
});
