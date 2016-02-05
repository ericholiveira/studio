var expect = require("chai").expect;
var Studio = require('../src/studio');
var jsMockito = require('jsmockito').JsMockito;
Studio = Studio.module('plugin_jsmockito');
describe("JSMockito plugin",function(){
    Studio.use(Studio.plugin.JsMockito(jsMockito));
    Studio(function basic(a,b){
        return a+b;
    });
    var basicService = Studio('basic');
    it("must dont change without call",function(done){
        basicService(1,1).then(function(res){
            expect(res).to.equal(2);
            done();
        }).catch(done);
    });
    it("must support mock",function(done){
        jsMockito.studio.mock('plugin_jsmockito/basic');
        basicService(1,1).then(function(res){
            var a = expect(res).to.undefined;
            done();
        }).catch(done);
    });
    it("must support clean all",function(done){
        jsMockito.studio.cleanAll();
        basicService(1,1).then(function(res){
            expect(res).to.equal(2);
            done();
        }).catch(done);
    });
    it("must support stub",function(done){
        var mock = jsMockito.studio.mock('plugin_jsmockito/basic');
        jsMockito.when(mock)(1,1).thenReturn(6);
        basicService(1,1).then(function(res){
            expect(res).to.equal(6);
            done();
        }).catch(done);
    });
    it("must support clean",function(done){
        jsMockito.studio.clean('plugin_jsmockito/basic');
        basicService(1,1).then(function(res){
            expect(res).to.equal(2);
            done();
        }).catch(done);
    });
    it("must support spy",function(done){
        var spy = jsMockito.studio.spy('plugin_jsmockito/basic');
        basicService(1,1).then(function(res){
            jsMockito.verify(spy,jsMockito.Verifiers.once());
            expect(res).to.equal(2);
            done();
        }).catch(done);
    });

});
