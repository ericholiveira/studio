Studio = require('../../compiled/core/studio');

describe("An actor process function", function() {
  var SENDER_ID = 'sender_timeout',
    RECEIVER_OK = 'receiver_timeout_ok',
      RECEIVER_CANCEL = 'receiver_timeout_cancel',
      TIMEOUT=20;
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  var receiverOk = new Studio.Actor({
    id: RECEIVER_OK,
    process: function(message, headers) {
      return new Studio.Promise(function(resolve){
        setTimeout(function(){
          resolve(message);
        },Math.round(TIMEOUT/2));
      });
    }
  });
  var receiver = new Studio.Actor({
    id: RECEIVER_CANCEL,
    process: function(message, headers) {
      return new Studio.Promise(function(resolve){
        setTimeout(function(){
          resolve(message);
        },TIMEOUT*2);
      });
    }
  });
  var message = 'Hello';
  it("should wait for timeout", function(done) {
    sender.sendWithTimeout(TIMEOUT,RECEIVER_OK, message).then(function(result) {
      expect(message).toBe(result);
      done();
    });
  });
  it("should fail after timeout", function(done) {
    sender.sendWithTimeout(TIMEOUT,RECEIVER_CANCEL, message).catch(function(error) {
      expect(error instanceof Studio.Exception.TimeoutException).toBe(true);
      done();
    });
  });
});
