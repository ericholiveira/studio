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
        Studio.promise.join(
            serviceSync(1,2).then(function(res){
                expect(res).to.equal(1+2);
            }).catch(done),
            serviceSync(-1,2).then(done).catch(function(e){
                expect(e.name).to.equal('FILTERED_MESSAGE');
            })
        ).then(function(){
           done();
        });
    });

    Studio(function sumPositiveAsync(param1,param2){
        return Studio.promise.resolve(param1+param2);
    }).filter(function * (param1,param2){
        return yield param1 > 0 && param2 > 0;
    });
    var serviceAsync = Studio('sumPositiveAsync');
    it("must accept generator filters",function(done){
        Studio.promise.join(
            serviceAsync(1,2).then(function(res){
                expect(res).to.equal(1+2);
            }).catch(done),
            serviceAsync(-1,2).then(done).catch(function(e){
                expect(e.name).to.equal('FILTERED_MESSAGE');
            })
        ).then(function(){
            done();
        });
    });

    Studio(function * sumPositiveGen(param1,param2){
        return yield param1+param2;
    }).filter(function (param1,param2){
        return Studio.promise.resolve( param1 > 0 && param2 > 0);
    });
    var serviceGen = Studio('sumPositiveGen');
    it("must accept promise filters",function(done){
        Studio.promise.join(
            serviceGen(1,2).then(function(res){
                expect(res).to.equal(1+2);
            }).catch(done),
            serviceGen(-1,2).then(done).catch(function(e){
                expect(e.name).to.equal('FILTERED_MESSAGE');
            })
        ).then(function(){
            done();
        });
    });

    Studio(function multipleFilter(param){
        return param;
    }).filter(function greaterThan0(param){
        return param>0;
    }).filter(function even (param){
        return param%2 === 0;
    });
    var multipleFilter = Studio('multipleFilter');
    it("must accept multiple filters",function(done){
        Studio.promise.join(
            multipleFilter(1).then(done).catch(function(e){
                expect(e.name).to.equal('FILTERED_MESSAGE');
            }),
            multipleFilter(-2).then(done).catch(function(e){
                expect(e.name).to.equal('FILTERED_MESSAGE');
            }),
            multipleFilter(2).then(function(res){
                expect(res).to.equal(2);
            }).catch(function(){})
        ).then(function(){
            done();
        });
    });

});
