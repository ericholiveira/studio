var expect = require("chai").expect;
var Studio = require('../src/studio');

describe("Basic Tests",function(){
    var _basic = Studio.service(function basic(){
        return true;
    });
    Studio(function direct(){
        return true;
    });
    it("must send and receive messages without error",function(done){
        var basicRef = Studio.ref('basic');
        basicRef().then(function(result){
            expect(result).to.equal(true);
            done();
        }).catch(done);
    });
    it("must run without error",function(done){
        _basic().then(function(result){
            expect(result).to.equal(true);
            done();
        }).catch(done);
    });
    it("must send and receive messages without error using Studio as function",function(done){
        var directRef = Studio('direct');
        directRef().then(function(result){
            expect(result).to.equal(true);
            done();
        }).catch(done);
    });
});
