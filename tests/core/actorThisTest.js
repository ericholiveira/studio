Broadway = require('../../target/core/broadway');

describe("An actor process function", function() {
  var SENDER_ID = 'sender_this',
    RECEIVER_ID = 'receiver_this';
  var sender = new Broadway.Actor({
    id: SENDER_ID,
    process: function(message, sender) {}
  });
  var receiver = new Broadway.Actor({
    id: RECEIVER_ID,
    process: function(message, sender) {
      return this;
    }
  });
  it("should have this as the actor", function(done) {
    sender.send(RECEIVER_ID, 'Hello').then(function(result) {
      expect(receiver).toBe(result);
      done();
    });
  });
});
