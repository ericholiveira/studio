Studio = require('../../compiled/core/studio');
describe("A router", function () {
	var SENDER_ID = 'sender_test_router',
		RECEIVER_ID = 'receiver_test_router';
	new Studio.Actor({
		id: SENDER_ID,
		process: function (message, sender) {}
	});
	new Studio.Actor({
		id: RECEIVER_ID,
		process: function (message, headers) {
			return this;
		}
	});
	it("should be able to retrieve all routes", function () {
		var count = 0,
			i = 0,
			routes = Studio.router.getAllRoutes();
		for (; i < routes.length; i++) {
			if (routes[i] === SENDER_ID || routes[i] === RECEIVER_ID) {
				count++;
			}
		}
		expect(count).toBe(2);
	});
	it("should return a failed promise when route don't exist", function (done) {
		Studio.router.send('test', '___NON___MAPPED___ROUTE___', {}).catch(
			function (err) {
				expect(err  instanceof Studio.Exception.RouteNotFoundException).toBe(true);
				done();
			});
	});
	it("should fail when instantiate actors with same id", function () {
		try{
			new Studio.Actor({
				id: SENDER_ID,
				process: function (message, sender) {}
			});
			expect(false).toBe(true);
		}catch(err){
			expect(err instanceof Studio.Exception.RouteAlreadyExistsException).toBe(true);
		}
	});
});
