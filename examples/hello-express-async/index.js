var Studio = require('../../compiled/core/studio');//Studio namespace
var express = require('express');
var app = express();// Create an express app
var driver = new Studio.Driver({
	/* Actors and drivers may define an 'initialize' function which is going to
	be called on object construction
	*/
	initialize: function () {
		/* On initialization we make the driver listen for request on a route
		*/
		app.get('/', function (req, res) {
			/* When this route is requested we send the message to the responsible
			actor using the 'send' function, this function is going to call the
			parser function of this router to discover the message content/headers
			and the receiver id. All 'send' functions on studio returns a promise
			when the promise is fulfilled we send the response content to the user
			browser
			*/
			driver.send(req, res).then(function (message) {
				res.send(message);
			});
		});
	},
	parser: function (req, res) {
		/* All drivers must define a 'parser' function which take the driver
		arguments and map to an object with sender,receiver,body and headers
		the parser function could also return a promise
		*/
		return {
			sender: 'expressDriver',
			receiver: 'helloActor',
			body: null,
			headers: null
		};
	}
});
//Now we create the actor who is going to handle the response
var hello = new Studio.Actor({
	id: 'helloActor',//Actor identification is required.
	process: function (body, headers, sender, receiver) {
		/* When a message arrives, the process function is going to receive a copy
		of that message, the process function may return any js object, nothing
		or a promise
		*/
		//Now we're going to return a promise
		var defer = Studio.Q.defer();
		console.log('Received message to actor = ' + hello.id);
		setTimeout(function(){
			//Wait 5 senconds before resolve the promise
			defer.resolve('Hello World!!!');
		},5000);
		return defer.promise;
	}
});
app.listen(3000);
console.log('Hello World application running on http://localhost:3000');
