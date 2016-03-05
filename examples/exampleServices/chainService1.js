var Studio = require('../../src/studio');

var chainService2 = Studio("chainService2"); //get a reference to the other service
Studio(function chainService1(body){
  var messageToChainService2 =(body || '')+ 'service1 -> ';
  console.log(this.id + ' was called');
  /* A service can call other services you just need a ref
   */
  return chainService2(messageToChainService2);
});
