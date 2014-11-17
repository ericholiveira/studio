Studio = require('../../compiled/core/studio');

describe("A router", function() {
  var SENDER_ID = 'sender_test_router',
    RECEIVER_ID = 'receiver_test_router';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    route: SENDER_ID,
    process: function(message, sender) {}
  });
  var receiver = new Studio.Actor({
    id: RECEIVER_ID,
    route: RECEIVER_ID,
    process: function(message, sender) {
      return this;
    }
  });
  it("should be able to retrieve all routes", function() {
    var count = 0,
      i = 0,
      routes = Studio.router.getAllRoutes();
    for (; i < routes.length; i++) {
      if (routes[i] === SENDER_ID || routes[i] === RECEIVER_ID) {
        count++;
      }
    }
    expect(count).toBe(2);
  });
});