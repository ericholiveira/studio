Studio = require('../../compiled/core/studio');

describe("An actor factory", function() {
  var SENDER_ID = 'sender_fact',
    RECEIVER_ID = 'rec_fact';
  var NEW_ACTOR_TYPE = Studio.Actor.extends({
    foo: 'bar'
  });
  var sender = Studio.actorFactory(function sender_fact() {});

  it("should create actor with a function", function(done) {
    var receiver = Studio.actorFactory(function rec_fact() {
      return true;
    });
    sender.send('rec_fact', 'hello').then(function(result) {
      expect(result).toBe(true);
      done();
    });
  });
  it("should create actor with options", function(done) {
    var receiver = Studio.actorFactory({
      rec_obj: function() {
        return 0;
      }
    });
    sender.send('rec_obj', 'hello').then(function(result) {
      expect(result).toBe(0);
      done();
    });
  });
  it("should create actor with a function and a type", function(done) {
    var receiver = Studio.actorFactory(function rec_fact2() {
      return this.foo;
    }, NEW_ACTOR_TYPE);
    sender.send('rec_fact2', 'hello').then(function(result) {
      expect(result).toBe('bar');
      done();
    });
  });
  it("should create actor with options", function(done) {
    var receiver = Studio.actorFactory({
      rec_obj2: function() {
        return this.foo;
      }
    }, NEW_ACTOR_TYPE);
    sender.send('rec_obj2', 'hello').then(function(result) {
      expect(result).toBe('bar');
      done();
    });
  });
});