var expect = require("chai").expect;
var Studio = require('../src/studio').module('serviceClass');

describe("ServiceClass Tests",function(){
    var _class = Studio.serviceClass(function MyClass(){
        this.hello = function(){
          return 'Hello';
        };
        this.str = 'str';
        this.sayHello = function *(name){
            var hello = yield this.hello();
            return hello + ' ' + name;
        };
        this.num = 3;
        this.obj = {foo:'bar'};
    });

    it("must keep all properties of the class",function(){
        expect(typeof Studio.serviceClass).to.equal('function');
        expect(typeof _class.hello).to.equal('function');
        expect(typeof _class.sayHello).to.equal('function');
        expect(_class.str).to.equal('str');
        expect(_class.num).to.equal(3);
        expect(_class.obj.foo).to.equal('bar');
    });

    it("must support call function",function(){
        return _class.hello().then(function(hello){
            expect(hello).to.equal('Hello');
        });
    });

    it("must support chained function call",function(){
        return _class.sayHello('Erich').then(function(hello){
            expect(hello).to.equal('Hello Erich');
        });
    });
});
