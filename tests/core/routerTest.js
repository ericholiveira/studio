Broadway = require('../../compiled/core/broadway');

describe("A router", function() {
  var SENDER_ID = 'sender_test_router',
    RECEIVER_ID = 'receiver_test_router';
  var sender = new Broadway.Actor({
    id: SENDER_ID,
    process: function(message, sender) {}
  });
  var receiver = new Broadway.Actor({
    id: RECEIVER_ID,
    process: function(message, sender) {
      return this;
    }
  });
  it("should be able to retrieve all routes", function() {
    var count=0,i=0,routes  = Broadway.router.getAllRoutes();
    for(;i<routes.length;i++){
      if(routes[i]===SENDER_ID ||routes[i]===RECEIVER_ID ){
        count++;
      }
    }
    expect(count).toBe(2);
  });
});
