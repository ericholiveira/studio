var Studio = require('../../compiled/core/studio');


describe("An actor filter", function() {
  var SENDER_ID = 'sender_this',
    RECEIVER_ID_TRUE = 'receiver_filter_TRUE',
    RECEIVER_ID_TRUTHY = 'receiver_filter_TRUTHY',
    RECEIVER_ID_FALSE = 'receiver_filter_FALSE',
    RECEIVER_ID_FALSY = 'receiver_filter_FALSY',
    RECEIVER_ID_PROMISE_TRUE = 'receiver_filter_PROMISE_TRUE',
    RECEIVER_ID_PROMISE_FALSE = 'receiver_filter_PROMISE_FALSE',
    RECEIVER_ID_PROMISE_REJECT = 'receiver_filter_PROMISE_REJECT';
  var message = 'Hello';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  new Studio.Actor({
    id: RECEIVER_ID_TRUE,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return true;
    }
  });
  new Studio.Actor({
    id: RECEIVER_ID_TRUTHY,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return 1;
    }
  });
  new Studio.Actor({
    id: RECEIVER_ID_FALSE,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return false;
    }
  });
  new Studio.Actor({
    id: RECEIVER_ID_FALSY,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return 0;
    }
  });
  new Studio.Actor({
    id: RECEIVER_ID_PROMISE_TRUE,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return new Studio.Promise(function(resolve){
        window.setTimeout(function(){
          resolve(true);
        },0);
      });
    }
  });
  new Studio.Actor({
    id: RECEIVER_ID_PROMISE_FALSE,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return new Studio.Promise(function(resolve){
        window.setTimeout(function(){
          resolve(false);
        },0);
      });
    }
  });
  new Studio.Actor({
    id: RECEIVER_ID_PROMISE_REJECT,
    process: function(message, headers) {
      return message;
    },
    filter:function(){
      return new Studio.Promise(function(resolve,reject){
        window.setTimeout(function(){
          reject(new Error('ERROR'));
        },0);
      });
    }
  });
  it("should accept all messages when returns true", function(done) {
    sender.send(RECEIVER_ID_TRUE, message).then(function(result) {
      expect(message).toBe(result);
      done();
    });
  });
  it("should accept all messages when returns truthy value", function(done) {
    sender.send(RECEIVER_ID_TRUTHY, message).then(function(result) {
      expect(message).toBe(result);
      done();
    });
  });
  it("should reject all messages when returns false", function(done) {
    sender.send(RECEIVER_ID_FALSE, message).catch(function(error) {
      expect(error instanceof Error).toBe(true);
      done();
    });
  });
  it("should reject all messages when returns falsy value", function(done) {
    sender.send(RECEIVER_ID_FALSY, message).catch(function(error) {
      expect(error instanceof Error).toBe(true);
      done();
    });
  });
  it("should accept all messages when returns promise resolved with truthy value", function(done) {
    sender.send(RECEIVER_ID_PROMISE_TRUE, message).then(function(result) {
      expect(message).toBe(result);
      done();
    });
  });
  it("should reject all messages when returns promise resolved with falsy value", function(done) {
    sender.send(RECEIVER_ID_PROMISE_FALSE, message).catch(function(error) {
      expect(error instanceof Error).toBe(true);
      done();
    });
  });
  it("should reject all messages when returns promise rejected with any value", function(done) {
    sender.send(RECEIVER_ID_PROMISE_REJECT, message).catch(function(error) {
      expect(error instanceof Error).toBe(true);
      done();
    });
  });
});
