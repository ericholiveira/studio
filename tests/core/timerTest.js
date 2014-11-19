Timer = require('../../compiled/core/util/timer');

describe("Timer", function() {
  it("must have an enqueue function", function(done) {
    expect(Timer.enqueue).toBeDefined();
    Timer.enqueue(done);
  });
});
