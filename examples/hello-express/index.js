var express = require('express');
var Studio = require('../../compiled/core/studio');
var app = express();
var driver = new Studio.Driver({
	initialize: function () {
		app.get('/', function (req, res) {
			driver.send(req, res).then(function (message) {
				res.send(message);
			});
		});
	},
	parser: function (req, res) {
		return {
			sender: 'expressDriver',
			receiver: 'helloActor',
			body: null,
			headers: null
		};
	}
});
var hello = new Studio.Actor({
	id: 'helloActor',
	process: function (body, headers, sender, receiver) {
		console.log('Received message to actor = ' + hello.id);
		return 'Hello World!!!';
	}
});
app.listen(3000);
console.log('Hello World application running on http://localhost:3000');
