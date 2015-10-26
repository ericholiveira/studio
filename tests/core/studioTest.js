Studio = require('../../compiled/core/studio');
describe("A Studio namespace", function () {
    var RECEIVER_ID = 'receiver_test_ref';
    new Studio.Actor({
        id: RECEIVER_ID,
        process: function (message, headers) {
            return this;
        }
    });
    it("should contain a ref property to bind send accepting string", function (done) {
        Studio.ref(RECEIVER_ID)('message').then(function(result){
            expect(result.id).toBe(RECEIVER_ID);
            done();
        });
    });
    it("should contain a ref property to bind send accepting object", function (done) {
        Studio.ref({
            sender:'someSender',
            receiver:RECEIVER_ID
        })('message').then(function(result){
            expect(result.id).toBe(RECEIVER_ID);
            done();
        });
    });
});
