Studio = require('../../compiled/core/studio');

describe("On error an actor", function() {
  var SENDER_ID = 'sender',
    RECEIVER_ID = 'receiver',
    RECEIVER_ERROR_MESSAGE = 'TEST';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  new Studio.Actor({
    id: RECEIVER_ID,
    process: function(message, headers) {
      throw new Error(RECEIVER_ERROR_MESSAGE);
    }
  });
  it("should call catch function of promise with an error", function(done) {
    sender.send(RECEIVER_ID, 'hello').fail(function(error) {
      expect(error).toBeDefined();
      expect(error.message).toBe(RECEIVER_ERROR_MESSAGE);
      done();
    });
  });

});