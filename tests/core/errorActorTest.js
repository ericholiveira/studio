Broadway = require('../../compiled/core/broadway');

describe("On error an actor", function () {
  var SENDER_ID = 'sender',
    RECEIVER_ID = 'receiver',
    RECEIVER_ERROR_MESSAGE='TEST';
  var sender = new Broadway.Actor({
    id: SENDER_ID,
    process: function (message, sender) {}
  });
  var receiver = new Broadway.Actor({
    id: RECEIVER_ID,
    process: function (message, sender) {
      throw new Error(RECEIVER_ERROR_MESSAGE);
    }
  });
  it("should call catch function of promise with an error", function (done) {
    sender.send(RECEIVER_ID, 'hello').fail(function(error){
      expect(error).toBeDefined();
      expect(error.message).toBe(RECEIVER_ERROR_MESSAGE);
      done();
    });
  });

});
