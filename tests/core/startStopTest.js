Studio = require('../../compiled/core/studio');

describe("An actor", function() {
  var SENDER_ID = 'sender_start_stop',
    RECEIVER_ID = 'receiver_start_stop';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  var receiver = new Studio.Actor({
    id: RECEIVER_ID,
    process: function(message, headers) {
      return true;
    }
  });
  it("must be able to stop and restart", function(done) {
    sender.send(RECEIVER_ID).then(function(response) {
      expect(response).toBe(true);
      receiver.stop();
      sender.send(RECEIVER_ID).catch(function(error) {
        expect(error).toBeDefined();
        receiver.start();
        sender.send(RECEIVER_ID).then(function(response) {
          expect(response).toBe(true);
          done();
        });
      });
    });
  });
});