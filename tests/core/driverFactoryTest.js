/**
 * Created by ericholiveira on 28/08/15.
 */
Studio = require('../../compiled/core/studio');

describe("A driver factory", function() {
    var driverFunction = Studio.driverFactory(function(to,body) {
            return to({
                sender: 'driverSync',
                receiver:'receiver_driver_factory',
                body: body,
                headers: null
            });
        });
    var driverFunction2 = Studio.driverFactory(function(to,body) {
        return to({
            sender: 'driverSync',
            receiver:'receiver_driver_factory',
            body: body,
            headers: null
        });
    },Studio.Driver.extends({foo:'bar'}));
    var receiver = Studio.actorFactory(function receiver_driver_factory(message){return message;});
    it("should be able to retrieve object on parse function", function(done) {
        var message = 'driverFunction';
        expect(driverFunction.driver).toBeDefined();
        driverFunction(message).then(function(result) {
            expect(message).toBe(result);
            done();
        });
    });
    it("should be extensible", function(done) {
        var message = 'driverFunction';
        expect(driverFunction2.driver).toBeDefined();
        expect(driverFunction2.driver.foo).toBe('bar');
        driverFunction2(driverFunction2.driver.foo).then(function(result) {
            expect(driverFunction2.driver.foo).toBe(result);
            done();
        });
    });
});
