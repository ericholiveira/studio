var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('plugin_retry');
describe("Retry plugin",function(){
    Studio.use(Studio.plugin.retry);
    Studio.use(Studio.plugin.timeout);
    var noRetry_RetryCount = 0;
    Studio(function noRetry(){
        noRetry_RetryCount++;
        throw new Error('noRetry');
    });
    var noRetryService = Studio('noRetry');
    it("must not retry unless specified",function(done){
        noRetryService().then(done).catch(function(e){
            expect(noRetry_RetryCount).to.equal(1);
            done();
        });
    });

    var retry1NoFilter_RetryCount = 0;
    Studio(function retry1NoFilter(){
        retry1NoFilter_RetryCount++;
        throw new Error('noRetry');
    }).retry(1);
    var retry1NoFilterService = Studio('retry1NoFilter');
    it("must retry without filters one time",function(done){
        retry1NoFilterService().then(done).catch(function(e){
            expect(retry1NoFilter_RetryCount).to.equal(2);
            done();
        });
    });

    var retry5NoFilter_RetryCount = 0;
    Studio(function retry5NoFilter(){
        retry5NoFilter_RetryCount++;
        throw new Error('noRetry');

    }).retry(5);
    var retry5NoFilterService = Studio('retry5NoFilter');
    it("must retry without filters several times",function(done){
        retry5NoFilterService().then(done).catch(function(e){
            expect(retry5NoFilter_RetryCount).to.equal(6);
            done();
        });
    });

    var retryFilter_RetryCount = 0;
    Studio(function retryFilter(){
        retryFilter_RetryCount++;
        throw new Error(retryFilter_RetryCount);
    }).retry(10,function(e){
        return +e.message < 3;
    });
    var retryFilterService = Studio('retryFilter');
    it("must retry with filters several times",function(done){
        retryFilterService().then(done).catch(function(e){
            expect(retryFilter_RetryCount).to.equal(3);
            done();
        });
    });

});
