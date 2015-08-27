var Studio = require('../../compiled/core/studio');

var chainActor1 = new Studio.Actor({
  id: 'chainActor1',
  process: function(body, headers, sender, receiver) {
    var messageToChainActor2 =(body || '')+ 'actor1 -> ';
    console.log('Received message to actor = ' + chainActor1.id);
    /* An actor can send message to other actors through 'send' method
     */
    return this.send('chainActor2', messageToChainActor2);
  }
});
