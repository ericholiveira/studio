Studio = require('../../compiled/core/studio');

describe("A driver", function() {
  var RECEIVER_ID = 'receiver_driver';
  var driverSync = new Studio.Driver({
    parser: function() {
      return {
        sender: 'driverSync',
        receiver: RECEIVER_ID,
        body: 'body',
        headers: null
      };
    }
  });
  var driverAsync = new Studio.Driver({
    parser: function() {
      var defer = Studio.Q.defer();
      window.setTimeout(function() {
        defer.resolve({
          sender: 'driverAsync',
          receiver: RECEIVER_ID,
          body: 'body',
          headers: null
        });
      }, 0);
      return defer.promise;
    }
  });
  var receiver = new Studio.Actor({
    id: RECEIVER_ID,
    process: function(message, headers) {
      return this;
    }
  });
  it("should be able to retrive object on parse function", function(done) {
    driverSync.send().then(function(result) {
      expect(receiver).toBe(result);
      done();
    });
  });
  it("should be able to retrive promise on parse function", function(done) {
    driverAsync.send().then(function(result) {
      expect(receiver).toBe(result);
      done();
    });
  });
});