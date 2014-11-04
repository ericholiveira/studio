Broadway = require('../../target/core/broadway');

describe("A message", function() {
  var SENDER_ID = 'sender_message',
    RECEIVER_ID = 'receiver_message';
  var sender = new Broadway.Actor({
    id: SENDER_ID,
    process: function(message, sender) {}
  });
  var receiver = new Broadway.Actor({
    id: RECEIVER_ID,
    process: function(message, sender) {
      message.hello = 'copy';
      message.inner.content = 'new';
      delete message.toDelete;
      return message;
    }
  });
  it("should be copied", function(done) {
    var _message = {
      hello: 'hello',
      inner: {
        content: 'content'
      },
      toDelete: 'delete'
    };
    sender.send(RECEIVER_ID, _message).then(function(message) {
      expect(message.hello).toBeDefined();
      expect(message.hello).not.toBe(_message.hello);
      expect(message.inner).toBeDefined();
      expect(message.inner.content).not.toBe(_message.inner.content);
      expect(message.toDelete).toBeUndefined();
      expect(_message.toDelete).toBeDefined();
      done();
    });
  });
});