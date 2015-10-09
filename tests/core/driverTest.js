Studio = require('../../compiled/core/studio');
var BBPromise = require('bluebird');

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
      return new BBPromise(function(resolve,reject){
        window.setTimeout(function() {
          resolve({
            sender: 'driverAsync',
            receiver: RECEIVER_ID,
            body: 'body',
            headers: null
          });
        }, 0);
      });
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
  it("should be able to instantiate without the 'new' keyword", function() {
    var driver = Studio.Driver({parser:function(){}});
    expect(driver instanceof Studio.Driver).toBe(true);
  });
});
