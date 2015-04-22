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
      message.arr.push(3);
      return message;
    }
  });
  it("should not change the originalMessage", function(done) {
    var message = {
      hello: 'hello',
      inner: {
        content: 'content'
      },
      toDelete: 'delete',
      arr:[1,2]
    };
    sender.send(RECEIVER_ID, message).then(function(result) {
      expect(message.hello).toBeDefined();
      expect(message.hello).toBe('hello');
      expect(message.inner).toBeDefined();
      expect(message.inner.content).toBe('content');
      expect(message.toDelete).toBeDefined();
      expect(message.toDelete).toBe('delete');
      expect(message.arr).toBeDefined();
      expect(message.arr.length).toBe(2);
      expect(message.arr[0]).toBe(1);
      expect(message.arr[1]).toBe(2);
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
  it("should accept user defined clone",function(){
    var obj = {a:1};
    obj.clone = function(){return null;};
    expect(clone(obj)).toBe(null);
  });
});
