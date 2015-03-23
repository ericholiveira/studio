Studio = require('../../compiled/core/studio');
clone = require('../../compiled/core/util/clone');

describe("A message", function() {
  var SENDER_ID = 'sender_message',
    RECEIVER_ID = 'receiver_message';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  new Studio.Actor({
    id: RECEIVER_ID,
    process: function(message, headers) {
      message.hello = 'copy';
      message.inner.content = 'new';
      delete message.toDelete;
      return message;
    }
  });
  it("should be immutable", function(done) {
    var message = {
      hello: 'hello',
      inner: {
        content: 'content'
      },
      toDelete: 'delete'
    };
    sender.send(RECEIVER_ID, message).then(function(result) {
      expect(result.hello).toBeDefined();
      expect(result.hello).toBe(message.hello);
      expect(result.inner).toBeDefined();
      expect(result.inner.content).toBe(message.inner.content);
      expect(result.toDelete).toBeDefined();
      expect(message.toDelete).toBeDefined();
      done();
    });
  });
  function MyModel(options){
    options = options || {};
    this.id=+options.id;
  }
  it("should be clonable",function(){
    var message = {
      hello: 'hello',
      inner: {
        content: 'content',
        num:new MyModel({id:33}),
        nul:null
      },
      toDelete: 'delete',
      num:1
    };
    var cloned = clone(message);
    expect(2).toBe(clone(2));
    expect(message.hello).toBe(cloned.hello);
    expect(message.inner.content).toBe(cloned.inner.content);
    expect(message.inner.num.id).toBe(cloned.inner.num.id);
    expect(message.inner.nul).toBe(cloned.inner.nul);
    expect(message.toDelete).toBe(cloned.toDelete);
    expect(message.num).toBe(cloned.num);
  });
});
