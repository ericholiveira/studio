var expect = require("chai").expect;
var Studio = require('../src/studio');
var otherModule = Studio.module('listeners2');
Studio = Studio.module('listeners');
describe("Listeners tests",function() {
    it("must support onStart and onStop",function(){
        var called_OnStart=false;
        var called_OnStop=false;
        Studio.use(function (options){
            options.onStart(function(service){
                if(service.id === 'listeners/noop'){
                    called_OnStart=true;
                }
            });
            options.onStop(function(service){
                if(service.id === 'listeners/noop'){
                    called_OnStop=true;
                }
            });
        },'listeners/noop');
        Studio(function noop(){}).stop();
        expect(called_OnStart).to.equal(true);
        expect(called_OnStop).to.equal(true);
    });

    it("must support interceptSend",function(){
        var message = 'hello';
        var extra = '!!!';
        Studio.use(function (options){
            options.interceptSend(function(send,route){
                expect(route).to.equal('listeners/interceptTest');
                return function(){
                    expect(arguments[0]).to.equal(message);
                    return send.apply(this,arguments);
                };
            });
        }, function(route){
            return route.indexOf('interceptTest') > 0;
        });
        return Studio(function interceptTest(param){
            expect(param).to.equal(message);
            return param + extra;
        })(message).then(function(result){
            expect(result).to.equal(message+extra);
            return otherModule(function _interceptTest(){
                return null; //dont need expectation, because the module already expect route === listener/interceptTest
            })();
        });
    });

    it("must accept string filters",function(done){
        var e;
        Studio.use(function (options){
            options.onStart(function(service){
                try {
                    expect(service.id).to.equal('listeners/noop2');
                }catch(err){
                        e = err;
                }
            });
            options.onStop(function(service){
                try {
                    expect(service.id).to.equal('listeners/noop2');
                }catch(err){
                    e = err;
                }
            });
        }, function(route){
            return route.indexOf('noop2') > 0;
        });
        //dont need expectation, because the module already expect route === listeners/noop2
        otherModule(function _noop2(){}).stop();
        Studio(function noop2(){}).stop();
        setTimeout(done.bind(null,e),10);
    });

    it("must accept array filters",function(done){
        var e;
        Studio.use(function (options){
            options.onStart(function(service){
                try {
                    expect(service.id).to.equal('listeners/noop3');
                }catch(err){
                    e = err;
                }
            });
            options.onStop(function(service){
                try {
                    expect(service.id).to.equal('listeners/noop3');
                }catch(err){
                    e = err;
                }
            });
        },['listeners/noop3']);
        Studio(function noop3(){}).stop();
        setTimeout(done.bind(null,e),10);
    });
    it("must accept regex filters",function(done){
        var e;
        Studio.use(function (options){
            options.onStart(function(service){
                try {
                    expect(service.id).to.equal('listeners/noop4');
                }catch(err){
                    e = err;
                }
            });
            options.onStop(function(service){
                try {
                    expect(service.id).to.equal('listeners/noop4');
                }catch(err){
                    e = err;
                }
            });
        },/listeners\/noop4/gi);
        Studio(function noop4(){}).stop();
        setTimeout(done.bind(null,e),10);
    });

});
