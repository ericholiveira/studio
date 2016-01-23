var expect = require("chai").expect;
var Studio = require('../src/studio');
describe("Modules",function(){
    it("must let services with same name from being created in different modules",function(){
        var name = 'name';
        Studio.module('module_test_1')({
            id:name,
            fn: function(){}
        });
        Studio.module('module_test_2')({
            id:name,
            fn: function(){}
        });
        expect(true).to.equal(true);
    });

    it("must forbid services with same name from being created in the same module",function(){
        var name = 'name';
        Studio.module('module_test_3')({
            id:name,
            fn: function(){}
        });
        try{
            Studio.module('module_test_3')({
                id:name,
                fn: function(){}
            });
            expect(false).to.equal(true);
        }catch(exc){
            expect(exc.name).to.equal('ROUTE_ALREADY_EXISTS');
        }
    });
    it("must let services being called with fullname",function(done){
        var name = 'name';
        Studio.module('module_test_4')({
            id:name,
            fn: function(){
                return true;
            }
        });
        Studio('module_test_4/'+name)().then(function(result){
            expect(result).to.equal(true);
            done();
        }).catch(done);
    });
    it("must let services being called with fullname using multiple modules",function(done){
        var name = 'name';
        Studio.module('module_test_5').module('module_test_6').module('module_test_7')({
            id:name,
            fn: function(){
                return true;
            }
        });
        Studio('module_test_5/module_test_6/module_test_7/'+name)().then(function(result){
            expect(result).to.equal(true);
            done();
        }).catch(done);
    });
});
