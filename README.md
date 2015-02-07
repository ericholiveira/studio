Studio.js
========

<img src="http://onstagejs.com/studio/images/STUDIO_logo.png" align="right" width="300px" />

Micro-services using actors model framework for JavaScript.

Studio is a lightweight framework for node (it also runs on major browsers, but the priority is node projects) developed to make easy to create reactive applications according to [reactive manifesto](http://www.reactivemanifesto.org/) principles. It uses an actor model (freely inspired by akka actors) implemented using [baconjs](https://github.com/baconjs/bacon.js) for reactive programming and [bluebird](https://github.com/petkaantonov/bluebird) a+ promises to solve the callback hell problem.

The main goal is to make all systems response, fault tolerant, scalable and mantainable. The development with Studio is (and always will be) as easy as possible, i'll keep a concise api, so other developers can create (and share) plugins for the framework.

Studio isn't only a library, it's a framework. It's really important to learn how to program and not only what each method can do.

I would love to receive feedback.Let me know if you've used it. What worked and what is wrong. Contribute and spread the word.


[![Build Status](https://travis-ci.org/onstagejs/studio.svg?branch=master)](https://travis-ci.org/onstagejs/studio)
[![npm version](https://badge.fury.io/js/studio.svg)](http://badge.fury.io/js/studio)
[![Dependency Status](https://david-dm.org/onstagejs/studio.svg)](https://david-dm.org/onstagejs/studio)
[![devDependency Status](https://david-dm.org/onstagejs/studio/dev-status.svg)](https://david-dm.org/onstagejs/studio#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/befaf49356ff402a830c45ee0f0ce1a0)](https://www.codacy.com/public/ericholiveira10/studio)
[![Issue Stats](http://issuestats.com/github/onstagejs/studio/badge/issue?style=flat)](http://issuestats.com/github/onstagejs/studio)
[![Issue Stats](http://issuestats.com/github/onstagejs/studio/badge/pr?style=flat)](http://issuestats.com/github/onstagejs/studio)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/onstagejs/studio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/studio.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/studio/)

Table of contents
========

- [Install](#install)
- [Intro](#intro)
- [API](#api)
- [Examples](#examples)
- [Pro tips](#pro-tips)
- [Dependencies](#dependencies)
- [Build](#build)
- [Test](#test)

Install
========

To install execute:

    npm install studio

Intro
========

We all want our systems to be responsive, scalable, fault tolerant, mantainable and for the last, but not least, easy and fun to develop. With this goals in mind i decided to build a [micro-services](http://martinfowler.com/articles/microservices.html) framework for nodejs using and architecture freely inspired on [actor model](http://en.wikipedia.org/wiki/Actor_model). I present you [Studio](https://github.com/onstagejs/studio)

Studio encourages you to use the best pratices of nodejs, it helps you to write simple, clean and completely decoupled code. And makes it very easy and fun.

First of all, almost everything in a Studio-based application is an [Actor](http://onstagejs.com/studio/docs/class/Actor.html).

So if you're used to build SOA or micro-services all your services (and possible layers, as DAOs for instance) are going to be declared as a STATELESS SINGLETON actor. Actors have an unique identifier and communicate (always) asynchronously through message passing. The benefits of this approach is that it is really easy to take just some of your actors to different servers and make a better use of it. Also, your actors have the free benefit of being naturally indempotent (each actor receives a COPY of the message, so one actor can't mess with the objects of another actor) increasing your code security, use [baconjs](https://github.com/baconjs/bacon.js) streams (which let you filter,map,buffer and do lots of different transformations to your messages) so you can keep your business rules apart for the validations increasing your code readability, and [bluebird](https://github.com/petkaantonov/bluebird) A+ promises to help you with the callback hell.

The other important class on Studio is the [Driver](http://onstagejs.com/studio/docs/class/Driver.html).

A driver takes your endpoint input and parses it in a message for a certain actor.

And this is it... this is all you need to create [reactive](http://reactivemanifesto.org) applications.


API
========

The API documentation can be accessed on [Docs](http://onstagejs.com/studio/docs/)

Examples
========

Follow the link to see all available [examples](https://github.com/onstagejs/studio/tree/master/examples)

Studio works with any web framework anf i'll create at least a "Hello World" application for the most used.

Here i`m going to put just a basic hello world with express, on [examples](https://github.com/onstagejs/studio/tree/master/examples) folder you can see the best pratices and more pratical examples ( with promises, errors, filters...)
Hello World with Express (using express 4.11.1):
```js
var express = require('express');
var Studio = require('studio'); //require Studio namespace
var app = express(); // create an express app
//The first thing we have to do is create a driver to listen to the request
var driver = new Studio.Driver({
/*
Driver and Actor can receive an initialize function on constructor,
this function is going to be executed on object creation
*/
	initialize: function () {
        //Make express listen to '/' route
		app.get('/', function (request, response) {
		    /*
		        we call the 'send' method of the driver passing express arguments,
		        Studio calls the 'parser' function of this driver to build a message and then deliver
		        this message to an actor, the send method ALWAYS returns a promise, so we call the
		        'then' method of this promise to take the actors response
		    */
			driver.send(request, response).then(function (helloMessage) {
				response.send(helloMessage);
			});
		});
	},
	/*
	All drivers needs a parser function which takes any object and transforms
	into an object with the fields 'sender', 'receiver', 'body', 'headers'
	*/
	parser: function (request, response) {
	//Since we don't need any request info we just fill the receiver's id
		return {
			sender: null,
			receiver: 'helloActor', // receiver identifier
			body: null,
			headers: null
		};
	}
});
//Create an actor
var hello = new Studio.Actor({
	id: 'helloActor', // All Actors needs an identifier
	/*
	    All actors also needs a process function, this function is going to be executed
	    when a message arrives this function can return any object or a promise,
	    returning a object is going to automatically fulfill the sender promise.
	    You can also throw an exception if any error occurs,
	    and then the sender promise is going to be rejected
	*/
	process: function (body, headers, sender, receiver) {
	/*An actor can communicate to others using the 'send' method as
		this.send('otherActor',{foo:'bar'});
	The 'send' message of an actor also returns a promise, so you can return it or use
	then/catch to deal with the message
	*/
		return 'Hello World!!!';
	}
});
app.listen(3000);// Listen on port 3000
```

On examples folder you can learn how to deal with errors, how to buffer or filter messages and much more.

Pro tips
========

- The most important tip is LEARN HOW TO DEAL WITH A+ PROMISES, i think this [blog](https://blog.domenic.me/youre-missing-the-point-of-promises/) have a incredible explanation of what A+ promises means and it saves you from callback hell
- Studio uses [Baconjs](https://github.com/baconjs/bacon.js) streams to deliver messages, so use it, to filter , map and apply different transformations to your messages. Baconjs is a powerful tool to keep your code clean, you use it to keep your validations and non-functional requisites away from your actor process function. This way your actor will be more easy to read, mantainable and testable.
- All your actor must be [indempotent](http://en.wikipedia.org/wiki/Idempotence) , Studio helps you to achieve this delivering to each actor a copy of the original message. Stop keep states on your code.
- When dealing with stream transformation of an actor keep in mind you're dealing with (a copy of) raw message, the ray message have sender, receiver,body,headers and callback attributes, if you decide to filter a message you need to call the callback function manually to give to the blocked sender a response, the same applies for buffer.


Dependencies
========
Studio depends on:
- [baconjs](https://github.com/baconjs/bacon.js) for stream manipulation
- [bluebird](https://github.com/petkaantonov/bluebird) for a+ promises usage
- [csextends](https://github.com/bevry/csextends) to make coffee classes extensible via javascript

Build
========

To build the project you have to run:

    grunt

This is going to generate js files (and source-maps) on "compiled" folder and a browserified version of Studio on "dist" folder

Test
========

Run test with:

    npm test
