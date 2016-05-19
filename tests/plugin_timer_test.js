var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('plugin_timer');
describe("Timer plugin",function(){
    it("must calculate time timeout and reports no error",function(done){
        Studio.use(Studio.plugin.timer(function(res){
            expect(res.receiver).to.equal('plugin_timer/noop');
            expect(res.time).to.gt(-1);
            var u = expect(res.err).to.be.undefined;
            done();
        }),'plugin_timer/noop');
        Studio(function noop(){
            return Studio.promise.delay(3);
        })();
    });
    it("must calculate time timeout and reports error",function(done){
        Studio.use(Studio.plugin.timer(function(res){
            expect(res.receiver).to.equal('plugin_timer/error');
            expect(res.time).to.gt(-1);
            var u = expect(res.err).to.exist;
            done();
        }),'plugin_timer/error');
        var res = Studio(function error(){
            return Studio.promise.reject(new Error());
        })();
        res.catch(function(){}); //Avoid unhandled error after the call
    });
});
