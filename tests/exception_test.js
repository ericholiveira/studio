var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('exception');
describe("Studio exceptions",function(){
    it("must throw ROUTE_NOT_FOUND on inexistent route",function(done){
        Studio('inexistent')().catch(function(exc){
            expect(exc.name).to.equal('ROUTE_NOT_FOUND');
            done();
        }).catch(done);
    });
    it("must throw ROUTE_ALREADY_EXISTS on duplicate route",function(){
        Studio(function some(){});
        try{
            Studio(function some(){});
            expect(false).to.equal(true);
        }catch(exc){
            expect(exc.name).to.equal('ROUTE_ALREADY_EXISTS');
        }
    });
    it("must throw SERVICE_NAME_OR_ID_NOT_FOUND on service without id (out of module)",function(){
        try{
            require('../src/studio')(function (){});
            expect(false).to.equal(true);
        }catch(exc){
            expect(exc.name).to.equal('SERVICE_NAME_OR_ID_NOT_FOUND');
        }
    });
    it("must throw SERVICE_NAME_OR_ID_NOT_FOUND on service without id (on module)",function(){
        try{
            Studio(function (){});
            expect(false).to.equal(true);
        }catch(exc){
            expect(exc.name).to.equal('SERVICE_NAME_OR_ID_NOT_FOUND');
        }
    });
    it("must throw SERVICE_FUNCTION_NOT_FOUND if dont have a function to run",function(){
        try{
            Studio({id:'dummy', fn:null});
            expect(false).to.equal(true);
        }catch(exc){
            expect(exc.name).to.equal('SERVICE_FUNCTION_NOT_FOUND');
        }
    });
});
