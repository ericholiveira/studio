var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('generators');
describe("Generator functions",function(){
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
});
