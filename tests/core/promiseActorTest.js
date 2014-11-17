Studio = require('../../compiled/core/studio');
Q = require('q');

describe("An async actor", function() {
  var SENDER_ID = 'sender',
    RECEIVER_OK_ID = 'receiverOk',
    RECEIVER_OK_RESULT = 'TEST',
    RECEIVER_ERROR_ID = 'receiverError',
    RECEIVER_ERROR_RESULT = 'TEST';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    route: SENDER_ID,
    process: function(message, sender) {}
  });
  var receiverOk = new Studio.Actor({
    id: RECEIVER_OK_ID,
    route: RECEIVER_OK_ID,
    process: function(message, sender) {
      var defer = Q.defer();
      setTimeout(function() {
        defer.resolve(RECEIVER_OK_RESULT);
      }, 0);
      return defer.promise;
    }
  });
  var receiverError = new Studio.Actor({
    id: RECEIVER_ERROR_ID,
    route: RECEIVER_ERROR_ID,
    process: function(message, sender) {
      var defer = Q.defer();
      setTimeout(function() {
        defer.reject(RECEIVER_ERROR_RESULT);
      }, 0);
      return defer.promise;
    }
  });
  it("should be able to return a promise with success", function(done) {
    sender.send(RECEIVER_OK_ID, 'hello').then(function(result) {
      expect(result).toBe(RECEIVER_OK_RESULT);
      done();
    });
  });
  it("should be able to return a promise with error", function(done) {
    sender.send(RECEIVER_ERROR_ID, 'hello').fail(function(result) {
      expect(result).toBe(RECEIVER_ERROR_RESULT);
      done();
    });
  });

});