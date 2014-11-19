Studio = require('../../compiled/core/studio');
BaseClass = require('../../compiled/core/util/baseClass');

describe("Actor class", function() {
  it("must have a extends function", function() {
    expect(Studio.Actor.extends).toBeDefined();
    var TestActor = Studio.Actor.extends({
      test: function() {}
    });
    var testActor = new TestActor({
      id: 'actor',
      process: function() {}
    });
    expect(testActor.send).toBeDefined();
    expect(testActor.test).toBeDefined();
    expect(testActor.extends).toBeUndefined();
  });
});

describe("Driver class", function() {
  it("must have a extends function", function() {
    expect(Studio.Driver.extends).toBeDefined();
    var TestDriver = Studio.Driver.extends({
      test: function() {}
    });
    var testDriver = new TestDriver({
      parser: function() {}
    });
    expect(testDriver.send).toBeDefined();
    expect(testDriver.test).toBeDefined();
    expect(testDriver.extends).toBeUndefined();
  });
});

describe("Base class", function() {
  it("must have a extends function", function() {
    expect(BaseClass["extends"]).toBeDefined();
    var OtherClass = BaseClass["extends"]({
      test: function() {}
    });
    var testOther = new OtherClass();
    expect(testOther.test).toBeDefined();
    expect(testOther.extends).toBeUndefined();
  });
});
