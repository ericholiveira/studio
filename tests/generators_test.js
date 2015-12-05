var expect = require("chai").expect;
var Studio = require('../src/studio');
var defer = Studio.defer;
Studio = Studio.module('generators');
describe("Generator functions",function(){
    var nodeCallbackSuccess = function(cb){
        process.nextTick(function(){
           cb(null,1);
        });
    };
    var nodeCallbackError = function(cb){
        process.nextTick(function(){
            cb(new Error('SOME ERROR CALLBACK'));
        });
    };
    Studio(function * gen_service(){
        return yield 1;
    });
    Studio(function * gen_service2(){
        var res = yield Studio('gen_service')();
        return res + 1;
    });
    Studio(function * gen_service_par(){
        var res = yield [Studio('gen_service')(),Studio('gen_service2')()];
        return res[0]+res[1];
    });
    Studio(function * callback_success(){
        var res = yield nodeCallbackSuccess(defer());
        return res;
    });
    Studio(function * exc(){
        yield 1;
        throw new Error('SOME ERROR GENERATOR');
    });
    Studio(function * promise_fail(){
        yield Promise.reject(new Error('SOME REJECT GENERATOR'));
    });
    Studio(function * callback_error(){
        yield nodeCallbackError(defer());
    });
    it("must support sync values",function(done){
        Studio('gen_service')().then(function(result){
            expect(result).to.equal(1);
            done();
        }).catch(done);
    });
    it("must support chain call",function(done){
        Studio('gen_service2')().then(function(result){
            expect(result).to.equal(2);
            done();
        }).catch(done);
    });
    it("must support parallel execution",function(done){
        Studio('gen_service_par')().then(function(result){
            expect(result).to.equal(3);
            done();
        }).catch(done);
    });
    it("must support node callbacks",function(done){
        Studio('callback_success')().then(function(result){
            expect(result).to.equal(1);
            done();
        }).catch(done);
    });
    it("must fail on exception thrown",function(done){
        Studio('exc')().catch(function(error){
            expect(error.message).to.equal('SOME ERROR GENERATOR');
            done();
        }).catch(done);
    });
    it("must fail on promise rejected",function(done){
        Studio('promise_fail')().catch(function(error){
            expect(error.message).to.equal('SOME REJECT GENERATOR');
            done();
        }).catch(done);
    });
    it("must fail on callback error",function(done){
        Studio('callback_error')().catch(function(error){
            expect(error.message).to.equal('SOME ERROR CALLBACK');
            done();
        }).catch(done);
    });
});
