var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('plugin_timeout');
describe("Timeout plugin",function(){
    Studio.use(Studio.plugin.timeout);
    Studio(function delayed(){
        return Studio.promise.delay('message',50);
    }).timeout(1);
    var delayedService = Studio('delayed');
    it("must respect timeout",function(done){
        delayedService().then(done).catch(function(e){
            expect(e.name).to.equal('TimeoutError');
            done();
        });
    });
});
