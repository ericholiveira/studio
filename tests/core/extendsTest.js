Broadway = require('../../target/core/broadway');

describe("Actor class", function () {
  it("must have a extends function", function () {
    expect(Broadway.Actor.extends).toBeDefined();
    var TestActor = Broadway.Actor.extends({
      test:function(){}
    });
    var testActor = new TestActor({
      id:'actor',
      process:function(){}
    });
    expect(testActor.send).toBeDefined();
    expect(testActor.test).toBeDefined();
    expect(testActor.extends).toBeUndefined();
  });
});

describe("Driver class", function () {
  it("must have a extends function", function () {
    expect(Broadway.Driver.extends).toBeDefined();
    var TestDriver = Broadway.Driver.extends({
      test:function(){}
    });
    var testActor = new TestDriver({});
    expect(testActor.send).toBeDefined();
    expect(testActor.test).toBeDefined();
    expect(testActor.extends).toBeUndefined();
  });
});
