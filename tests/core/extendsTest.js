Studio = require('../../compiled/core/studio');

describe("Actor class", function () {
  it("must have a extends function", function () {
    expect(Studio.Actor.extends).toBeDefined();
    var TestActor = Studio.Actor.extends({
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
    expect(Studio.Driver.extends).toBeDefined();
    var TestDriver = Studio.Driver.extends({
      test:function(){}
    });
    var testActor = new TestDriver({});
    expect(testActor.send).toBeDefined();
    expect(testActor.test).toBeDefined();
    expect(testActor.extends).toBeUndefined();
  });
});
