var expect = require("chai").expect;
var Studio = require('../src/studio');
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

    it("must accept string filters",function(){
        Studio.use(function (options){
            options.onStart(function(service){
                expect(service.id).to.equal('listeners/noop2');
            });
            options.onStop(function(service){
                expect(service.id).to.equal('listeners/noop2');
            });
        },'listeners/noop2');
        Studio(function noop2(){}).stop();
    });

    it("must accept array filters",function(){
        Studio.use(function (options){
            options.onStart(function(service){
                expect(service.id).to.equal('listeners/noop3');
            });
            options.onStop(function(service){
                expect(service.id).to.equal('listeners/noop3');
            });
        },['listeners/noop3']);
        Studio(function noop3(){}).stop();
    });
    it("must accept regex filters",function(){
        Studio.use(function (options){
            options.onStart(function(service){
                expect(service.id).to.equal('listeners/noop4');
            });
            options.onStop(function(service){
                expect(service.id).to.equal('listeners/noop4');
            });
        },/listeners\/noop4/gi);
        Studio(function noop4(){}).stop();
    });

    it("must support onCall",function(done){
        var called_1=false;
        var called_2=false;
        Studio.use(function (options){
            options.onCall(function * (message){
                called_1 = true;
                return yield this.next(message);
            });
        },'listeners/noop5');
        Studio.use(function (options){
            options.onCall(function (message){
                called_2 = true;
                return this.next(message);
            });
        },'listeners/noop5');
        Studio(function noop5(message){
            expect(message).to.equal('bla');
            done();
        });
        Studio('noop5')('bla');
        expect(called_1).to.equal(true);
        expect(called_2).to.equal(true);
    });

});