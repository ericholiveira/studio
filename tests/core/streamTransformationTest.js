Studio = require('../../compiled/core/studio');

describe("A Stream", function() {
  var SENDER_ID = 'sender_transformation',
    RECEIVER_ID = 'receiver_transformation_group';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    route: SENDER_ID,
    process: function(message, sender) {}
  });
  var receiver = new Studio.Actor({
    id: RECEIVER_ID,
    route: RECEIVER_ID,
    process: function(message, sender) {
      return message;
    }
  });

  it("should be able to be grouped", function(done) {
    receiver.addTransformation(function(stream) {
      return stream.bufferWithCount(3).map(function(array) {
        var i = 0;
        var acc = {};
        for (; i < array.length; i++) {
          acc.sender = array[i].sender;
          acc.receiver = array[i].receiver;
          acc.callbacks = acc.callbacks || [];
          acc.callbacks.push(array[i].callback);
          acc.body = acc.body || [];
          acc.body.push(array[i].body);
        }
        acc.callback = function(err, result) {
          var i = 0;
          for (; i < acc.callbacks.length; i++) {
            acc.callbacks[i](err, result);
          }
        };
        return acc;
      });
    });
    Studio.Q.all(sender.send(RECEIVER_ID, 1), sender.send(RECEIVER_ID,
      2), sender.send(RECEIVER_ID, 3)).then(function(result) {
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
      expect(result[2]).toBe(3);
      done();
    });
  });
});