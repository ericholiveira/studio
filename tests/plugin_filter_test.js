var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('plugin_filter');
describe("Filter plugin",function(){
    Studio(function sumPositive(param1,param2){
        return param1+param2;
    }).filter(function(param1,param2){
        return param1 > 0 && param2 > 0;
    });
    var serviceSync = Studio('sumPositive');
    it("must accept sync filters",function(done){
        serviceSync(1,2).then(function(res){
            expect(res).to.equal(1+2);
            done();
        }).catch(done);
        serviceSync(-1,2).then(done).catch(function(e){
            expect(e.code).to.equal('FILTERED_MESSAGE');
        });
    });

    Studio(function sumPositiveAsync(param1,param2){
        return Studio.promise.resolve(param1+param2);
    }).filter(function * (param1,param2){
        return yield param1 > 0 && param2 > 0;
    });
    var serviceAsync = Studio('sumPositiveAsync');
    it("must accept async filters",function(done){
        serviceAsync(1,2).then(function(res){
            expect(res).to.equal(1+2);
            done();
        }).catch(done);
        serviceAsync(-1,2).then(done).catch(function(e){
            expect(e.code).to.equal('FILTERED_MESSAGE');
        });
    });

    Studio(function * sumPositiveGen(param1,param2){
        return yield param1+param2;
    }).filter(function (param1,param2){
        return Studio.promise.resolve( param1 > 0 && param2 > 0);
    });
    var serviceGen = Studio('sumPositiveGen');
    it("must accept async filters",function(done){
        serviceGen(1,2).then(function(res){
            expect(res).to.equal(1+2);
            done();
        }).catch(done);
        serviceGen(-1,2).then(done).catch(function(e){
            expect(e.code).to.equal('FILTERED_MESSAGE');
        });
    });

});
