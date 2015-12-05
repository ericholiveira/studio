var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('arguments');
describe("Service arguments",function(){
    Studio(function none(){
        return 1;
    });
    Studio(function one(first){
        return first +1;
    });
    Studio(function two(first,second){
        return first +second;
    });
    Studio(function three(first,second,third){
        return first + second + third;
    });
    Studio(function multiple(){
        return [].slice.call(arguments);
    });
    it("must accept no arguments",function(done){
        Studio('none')().then(function(result){
            expect(result).to.equal(1);
            done();
        }).catch(done);
    });
    it("must accept one argument",function(done){
        Studio('one')(1).then(function(result){
            expect(result).to.equal(2);
            done();
        }).catch(done);
    });
    it("must accept two arguments",function(done){
        Studio('two')(1,2).then(function(result){
            expect(result).to.equal(3);
            done();
        }).catch(done);
    });
    it("must accept three arguments",function(done){
        Studio('three')(1,2,3).then(function(result){
            expect(result).to.equal(6);
            done();
        }).catch(done);
    });
    it("must accept multiple undeclared arguments",function(done){
        Studio('multiple')(1,2,3).then(function(result){
            expect(result[0]).to.equal(1);
            expect(result[1]).to.equal(2);
            expect(result[2]).to.equal(3);
            done();
        }).catch(done);
    });
});
