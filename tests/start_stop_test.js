var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('start_stop');
describe("Start/stop feature",function(){
    var _basic = Studio(function basic(){
        return true;
    });
    it("must be stoppable",function(done){
        var basicService = Studio('basic');
        basicService().then(function(result){
            expect(result).to.equal(true);
            _basic.stop();
            return basicService();
        }).catch(function(exc){
            expect(exc.name).to.equal('ROUTE_NOT_FOUND');
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
