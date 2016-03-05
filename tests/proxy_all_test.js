var expect = require("chai").expect;
var Studio = require('../src/studio');
var StudioAll = Studio.module('all_test');
describe("Studio.services Tests",function(){
    var studioAll = StudioAll.services();
    var studio = Studio.services();
    StudioAll(function basic(){
        return true;
    });
    StudioAll(function error(){
        throw new Error('SOME ERROR');
    });
    StudioAll.module('deeper')(function deeperTest(value){
        return value;
    });
    it("must define services function",function(){
        expect(typeof Studio.services).to.equal('function');
        expect(typeof StudioAll.services).to.equal('function');
    });
    it("must support services from root",function(){
        var allRef = studio.all_test;
        var basicRef = studioAll.basic;
        return studio.all_test.basic().then(function(result){
            expect(result).to.equal(true);
        });
    });
    it("must support services from module",function(){
        var basicRef = studioAll.basic;
        return studioAll.basic().then(function(result){
            expect(result).to.equal(true);
        });
    });

    it("must support services from root with error response",function(){
        var allRef = studio.all_test;
        var errorRef = studioAll.error;
        return studio.all_test.error().catch(function(error){
            expect(error.message).to.equal('SOME ERROR');
        });
    });
    it("must support services from module with error response",function(){
        var errorRef = studioAll.error;
        return studioAll.error().catch(function(error){
            expect(error.message).to.equal('SOME ERROR');
        });
    });

    it("must support multi layers",function(){
        return Studio.promise.join(
            studio.all_test.deeper.deeperTest(1).then(function(result){
                expect(result).to.equal(1);
            }),
            studioAll.deeper.deeperTest(1).then(function(result){
                expect(result).to.equal(1);
            }),
            StudioAll.module('deeper').services().deeperTest(1).then(function(result){
                expect(result).to.equal(1);
            }),
            StudioAll.module('deeper')('deeperTest')(1).then(function(result){
                expect(result).to.equal(1);
            })
        );
    });
    it("must support navigation even if route is not defined (from module)",function(){
        return studioAll().catch(function(error){
            expect(error.name).to.equal('ROUTE_NOT_FOUND');
        });
    });
    it("must support navigation even if route is not defined ",function(){
        return studioAll.unmappedRoute().catch(function(error){
            expect(error.name).to.equal('ROUTE_NOT_FOUND');
        });
    });
});
