var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('start_stop');
describe("Start/stop feature",function(){
    var _basic = Studio(function basic(){
        return true;
    });
    it("must be stoppable",function(done){
        Studio('basic')().then(function(result){
            expect(result).to.equal(true);
            _basic.stop();
            return Studio('basic')();
        }).catch(function(exc){
            expect(exc.code).to.equal('ROUTE_NOT_FOUND');
            done();
        });
    });

    it("must be restartable",function(done){
        _basic.start();
        _basic.stop();
        _basic.start();
        _basic.stop();
        _basic.start();
        Studio('basic')().then(function(result){
            expect(result).to.equal(true);
            done();
        });
    });
});
