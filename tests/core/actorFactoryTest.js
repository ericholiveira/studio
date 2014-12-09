Studio = require('../../compiled/core/studio');

describe("An actor factory", function() {
  var SENDER_ID = 'sender_factory_1',
    RECEIVER_ID = 'receiver_factory_1',
    INTERCEPTOR_ID = 'interceptor_1';

  var senderPromise = Studio.actorFactory.send(Studio.actorFactory.id, {
    id: SENDER_ID,
    process: function(message, sender) {}
  });

  var receiverPromise = Studio.actorFactory.send(Studio.actorFactory.id, {
    id: RECEIVER_ID,
    process: function(message, sender) {
      return true;
    }
  });
  it("should be able to create an actor", function(done) {
    Studio.Q.all([senderPromise, receiverPromise]).then(function(
      response) {
      var sender = response[0];
      var receiver = response[1];
      sender.send(RECEIVER_ID, 'factory').then(function(result) {
        expect(result).toBe(true);
        done();
      });
    });
  });


  it("should be able to intercept an actor", function(done) {
    Studio.Q.all([senderPromise, receiverPromise]).then(function(
      response) {
      var sender = response[0];
      var receiver = response[1];
      var interceptor = Studio.interceptorFactory.send(Studio.interceptorFactory
        .id, {
          id: INTERCEPTOR_ID,
          routes: RECEIVER_ID,
          process: function(message, sender) {
            console.log('INTERCEPTOR');
            return message.next();
          }
        }).then(function(interceptor) {
        sender.send(RECEIVER_ID, 'factory').then(function(
          result) {
          expect(result).toBe(true);
          done();
        });
      });
    });
  });
});