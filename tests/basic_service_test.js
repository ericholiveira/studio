var expect = require("chai").expect;
var Studio = require('../src/studio');

describe("Basic Service Tests",function(){
    var _basic = Studio.service(function basic(){
        return true;
    });
    Studio(function direct(){
        return true;
    });
    Studio(function exc(){
        throw new Error('SOME ERROR');
    });
    Studio(function promise_fail(){
        return Promise.reject(new Error('SOME REJECT'));
    });
    it("must send and receive messages without error",function(done){
        var basicRef = Studio.ref('basic');
        basicRef().then(function(result){
            expect(result).to.equal(true);
            done();
        });
    });
    it("must run without error",function(done){
        _basic().then(function(result){
            expect(result).to.equal(true);
            done();
        });
    });
    it("must send and receive messages without error using Studio as function",function(done){
        var directRef = Studio('direct');
        directRef().then(function(result){
            expect(result).to.equal(true);
            done();
        });
    });
    it("must fail on exception thrown",function(done){
        Studio('exc')().catch(function(error){
            expect(error.message).to.equal('SOME ERROR');
            done();
        }).catch(done);
    });
    it("must fail on promise rejected",function(done){
        Studio('promise_fail')().catch(function(error){
            expect(error.message).to.equal('SOME REJECT');
            done();
        }).catch(done);
    });
});
