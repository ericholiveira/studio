var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('plugin_retry');
describe("Retry plugin",function(){
    Studio.use(Studio.plugin.retry());
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
    var retry1NoFilter_Param1,retry1NoFilter_Param2;
    Studio(function retry1NoFilter(param1,param2){
        retry1NoFilter_Param1 = param1;
        retry1NoFilter_Param2 = param2;
        retry1NoFilter_RetryCount++;
        throw new Error('noRetry');
    }).retry({max:1});
    var retry1NoFilterService = Studio('retry1NoFilter');
    it("must retry without filters one time",function(done){
        var param1 ='abc',param2=3;
        retry1NoFilterService(param1,param2).then(done).catch(function(e){
            expect(retry1NoFilter_RetryCount).to.equal(2);
            expect(retry1NoFilter_Param1).to.equal(param1);
            expect(retry1NoFilter_Param2).to.equal(param2);
            done();
        });
    });

    var retry5NoFilter_RetryCount = 0;
    Studio(function retry5NoFilter(){
        retry5NoFilter_RetryCount++;
        throw new Error('noRetry');

    }).retry({max:5});
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
    }).retry({max:10,filter:function(e){
        return +e.message < 3;
    }});
    var retryFilterService = Studio('retryFilter');
    it("must retry with filters several times",function(done){
        retryFilterService().then(done).catch(function(e){
            expect(retryFilter_RetryCount).to.equal(3);
            done();
        });
    });




    var retry1NoFilterWithInterval_RetryCount = 0;
    Studio(function retry1NoFilterWithInterval(){
        retry1NoFilterWithInterval_RetryCount++;
        throw new Error('noRetry');
    }).retry({max:1,initialInterval:10});
    var retry1NoFilterWithIntervalService = Studio('retry1NoFilterWithInterval');
    it("must retry with initial interval one time",function(done){
        var initialTime = new Date().getTime();
        retry1NoFilterWithIntervalService().then(done).catch(function(e){
            var now = new Date().getTime();
            expect(retry1NoFilterWithInterval_RetryCount).to.equal(2);
            expect(now - initialTime).to.gte(10);
            done();
        });
    });


    var retry2NoFilterWithIntervalWithExponentialFactor_RetryCount = 0;
    Studio(function retry2NoFilterWithIntervalAndExponentialFactor(){
        retry2NoFilterWithIntervalWithExponentialFactor_RetryCount++;
        throw new Error('noRetry');
    }).retry({max:2,initialInterval:5,factor:3});
    var retry2NoFilterWithIntervalAndExponentialFactorService = Studio('retry2NoFilterWithIntervalAndExponentialFactor');
    it("must retry with initial interval one time",function(done){
        var initialTime = new Date().getTime();
        retry2NoFilterWithIntervalAndExponentialFactorService().then(done).catch(function(e){
            var now = new Date().getTime();
            expect(retry2NoFilterWithIntervalWithExponentialFactor_RetryCount).to.equal(3);
            expect(now - initialTime).to.gte(5+5*3);
            done();
        });
    });


    var retry1BeforeCall = Studio('retry1BeforeCall');
    var retry1BeforeCall_Param1,retry1BeforeCall_Param2;
    it("must call a function before running the service",function(done){
        var now = new Date().getTime();
        var param1 ='abc',param2=3;
        var beforeInfo;
        Studio(function retry1BeforeCall(param1,param2){
            retry1BeforeCall_Param1 = param1;
            retry1BeforeCall_Param2 = param2;
            throw new Error('');
        }).retry({max:1,beforeCall:function(options){
            beforeInfo= options;
        }});
        retry1BeforeCall(param1,param2).then(done).catch(function(e){
            expect(beforeInfo.service).to.equal('plugin_retry/retry1BeforeCall');
            expect(beforeInfo.params[0]).to.equal(param1);
            expect(beforeInfo.params[1]).to.equal(param2);
            expect(beforeInfo.initialTimestamp).to.gte(now);
            expect(beforeInfo.success).to.equal(null);
            expect(beforeInfo.error).to.equal(null);
            expect(beforeInfo.status).to.equal('PROCESSING');
            expect(beforeInfo.finalTimestamp).to.equal(null);
            expect(retry1NoFilter_Param1).to.equal(param1);
            expect(retry1NoFilter_Param2).to.equal(param2);
            done();
        });
    });


    var retry1AfterCallService = Studio('retry1AfterCall');
    var retry1AfterCall_Param1,retry1AfterCall_Param2;
    it("must call a function after running the service on success",function(done){
        var now = new Date().getTime();
        var param1 ='abc',param2=3;
        var afterInfo;
        Studio(function retry1AfterCall(param1,param2){
            retry1AfterCall_Param1 = param1;
            retry1AfterCall_Param2 = param2;
            return 'hello';
        }).retry({max:1,afterCall:function(options){
            afterInfo= options;
        }});
        retry1AfterCallService(param1,param2).then(function(res){
            expect(afterInfo.service).to.equal('plugin_retry/retry1AfterCall');
            expect(afterInfo.params[0]).to.equal(param1);
            expect(afterInfo.params[1]).to.equal(param2);
            expect(afterInfo.initialTimestamp).to.gte(now);
            expect(afterInfo.success).to.equal('hello');
            expect(afterInfo.error).to.equal(null);
            expect(afterInfo.status).to.equal('SUCCESS');
            expect(afterInfo.finalTimestamp).to.gte(now);
            expect(retry1NoFilter_Param1).to.equal(param1);
            expect(retry1NoFilter_Param2).to.equal(param2);
            expect(res).to.equal('hello');
            done();
        });
    });



    var retry1AfterCallErrorService = Studio('retry1AfterCallError');
    var retry1AfterCallError_Param1,retry1AfterCallError_Param2;
    it("must call a function after running the service on error",function(done){
        var now = new Date().getTime();
        var param1 ='abc',param2=3;
        var afterInfo;
        Studio(function retry1AfterCallError(param1,param2){
            retry1AfterCallError_Param1 = param1;
            retry1AfterCallError_Param2 = param2;
            throw new Error('error');
        }).retry({max:1,afterCall:function(options){
            afterInfo= options;
        }});
        retry1AfterCallErrorService(param1,param2).catch(function(e){
            expect(afterInfo.service).to.equal('plugin_retry/retry1AfterCallError');
            expect(afterInfo.params[0]).to.equal(param1);
            expect(afterInfo.params[1]).to.equal(param2);
            expect(afterInfo.initialTimestamp).to.gte(now);
            expect(afterInfo.success).to.equal(null);
            console.error(afterInfo.error);
            expect(afterInfo.error.message).to.equal('error');
            expect(afterInfo.status).to.equal('ERROR');
            expect(afterInfo.finalTimestamp).to.gte(now);
            expect(retry1AfterCallError_Param1).to.equal(param1);
            expect(retry1AfterCallError_Param2).to.equal(param2);
            done();
        });
    });
});
