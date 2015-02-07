Studio = require('../../compiled/core/studio');
var BBPromise = require('bluebird');

describe("An async actor", function() {
  var SENDER_ID = 'sender',
    RECEIVER_OK_ID = 'receiverOk',
    RECEIVER_OK_RESULT = 'TEST',
    RECEIVER_ERROR_ID = 'receiverError',
    RECEIVER_ERROR_RESULT = 'TEST';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  new Studio.Actor({
    id: RECEIVER_OK_ID,
    process: function(message, headers) {
      return new BBPromise(function(resolve,reject){
        setTimeout(function() {
          resolve(RECEIVER_OK_RESULT);
        }, 0);
      });
    }
  });
  new Studio.Actor({
    id: RECEIVER_ERROR_ID,
    process: function(message, headers) {
      return new BBPromise(function(resolve,reject){
        setTimeout(function() {
          reject(RECEIVER_ERROR_RESULT);
        }, 0);
      });
    }
  });
  it("should be able to return a promise with success", function(done) {
    sender.send(RECEIVER_OK_ID, 'hello').then(function(result) {
      expect(result).toBe(RECEIVER_OK_RESULT);
      done();
    });
  });
  it("should be able to return a promise with error", function(done) {
    sender.send(RECEIVER_ERROR_ID, 'hello').catch(function(result) {
      expect(result).toBe(RECEIVER_ERROR_RESULT);
      done();
    });
  });

});
