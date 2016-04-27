var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('plugin_rich_errors');
describe("Rich Errors plugin",function(){
    Studio.use(Studio.plugin.richErrors());
    Studio(function test(){
        throw new Error();
    });
    it("must add timestamp on errors",function(){
        return Studio('test')().catch(function(err){
            expect(err._timestamp).to.gt(0);
        });
    });
    it("must add params and timestamp on errors",function(){
        return Studio('test')(1).catch(function(err){
            expect(err._timestamp).to.gt(0);
            expect(err._params.length).to.equal(1);
            expect(err._params[0]).to.equal(1);
        });
    });
    it("must add multiple params and timestamp on errors",function(){
        return Studio('test')(1,2,3).catch(function(err){
            expect(err._timestamp).to.gt(0);
            expect(err._params.length).to.equal(3);
            expect(err._params[0]).to.equal(1);
            expect(err._params[1]).to.equal(2);
            expect(err._params[2]).to.equal(3);
        });
    });
});
