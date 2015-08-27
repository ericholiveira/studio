Studio.js
========

<img src="http://ericholiveira.com/studio/images/STUDIO_logo.png" align="right" width="300px" />

Micro-services using actors model framework for JavaScript.

Studio is a lightweight framework for node development to make easy to create reactive applications according to [reactive manifesto](http://www.reactivemanifesto.org/) principles. It uses an actor model (freely inspired by akka actors) implemented using [baconjs](https://github.com/baconjs/bacon.js) for reactive programming and [bluebird](https://github.com/petkaantonov/bluebird) a+ promises to solve the callback hell problem.

The main goal is to make all systems response, fault tolerant, scalable and mantainable. The development with Studio is (and always will be) as easy as possible, i'll keep a concise api, so other developers can create (and share) plugins for the framework.

Studio isn't only a library, it's a framework. It's really important to learn how to program and not only what each method can do.

I would love to receive feedback.Let me know if you've used it. What worked and what is wrong. Contribute and spread the word.


[![Build Status](https://travis-ci.org/ericholiveira/studio.svg?branch=master)](https://travis-ci.org/ericholiveira/studio)
[![npm version](https://badge.fury.io/js/studio.svg)](http://badge.fury.io/js/studio)
[![Dependency Status](https://david-dm.org/ericholiveira/studio.svg)](https://david-dm.org/ericholiveira/studio)
[![devDependency Status](https://david-dm.org/ericholiveira/studio/dev-status.svg)](https://david-dm.org/ericholiveira/studio#info=devDependencies)
[![Issue Stats](http://issuestats.com/github/ericholiveira/studio/badge/issue?style=flat)](http://issuestats.com/github/ericholiveira/studio)
[![Issue Stats](http://issuestats.com/github/ericholiveira/studio/badge/pr?style=flat)](http://issuestats.com/github/ericholiveira/studio)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/onstagejs/studio?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/studio.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/studio/)

Table of contents
========

- [Install](#install)
- [Intro](#intro)
- [API](#api)
- [Examples](#examples)
- [Filters](#filters)
- [Streams](#streams)
- [Timeouts](#timeouts)
- [Co / Generators and flow-control](#generators)
- [Plugins](#plugins)
- [Zero Downtime Reload](#zero-downtime-reload)
- [Pro tips](#pro-tips)
- [Dependencies](#dependencies)
- [Build](#build)
- [Test](#test)
- [License](#license)

Install
========

To install execute:

    npm install studio --save

Intro
========

We all want our systems to be responsive, scalable, fault tolerant, mantainable and for the last, but not least, easy and fun to develop. With this goals in mind i decided to build a [micro-services](http://martinfowler.com/articles/microservices.html) framework for nodejs using and architecture freely inspired on [actor model](http://en.wikipedia.org/wiki/Actor_model). I present you [Studio](https://github.com/onstagejs/studio)

Studio makes easy to create code without ANY dependency between your actors, so you can deploy all in a single machine or just easily change to each one in a different machine or anything between. It also enables operations timeouts, zero-downtime reload, let-it-crash approach (stop to be affraid of exceptions, Studio handles it to you), plugin and makes it nearly impossible to falls in a callback hell. Supports any web framework (we have examples with express, restify, hapi and even koa) and flow-control libs (we have an example with Co for those who loves generators).

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

Studio works with any web framework.

Here i`m going to put just a basic hello world with express, on [examples](https://github.com/onstagejs/studio/tree/master/examples) folder you can see the best pratices and more pratical examples ( with promises, errors, filters...)
Hello World with Express, Restify , Koa or Hapi :
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
	then/catch to deal with the message. Also you can throw an exception here in case of fail
	*/
		return 'Hello World!!!';
	}
});
app.listen(3000);// Listen on port 3000
```

On examples folder you can learn how to deal with errors, how to buffer or filter messages and much more.

If you think theres too much boilerplate to create an actor, you can define an actor using 3 different approaches. The 3 actors described above are the same:

```js
new Studio.Actor({
	id: 'helloActor',
	process: function (body, headers, sender, receiver) {
		return 'Hello World!!!';
	}
});
```
```js
Studio.actorFactory({
	helloActor: function (body, headers, sender, receiver) {
		return 'Hello World!!!';
	}
});
```
```js
Studio.actorFactory(function helloActor (body, headers, sender, receiver) {return 'Hello World!!!';});
```

Filters
========

Validation and filters are a common use for your actors, so the Studio already make it as a built-in resource. Any actor can have a "filter" function to handle this. As any other action on Studio, it already deals with async or sync results automatically.

```js
new Studio.Actor({
  id: 'helloActorFiltered',
  process: function(body, headers, sender, receiver) {
    console.log('Received message to actor = ' + userActor.id);
    return 'Hello';
  },
  /* Let's say you have a rule where the body needs to be greater than 0.
     You could implement this logic on userActor 'process'
     function, but a better approach would be to keep your filter logic away from
     your business logic code. So all actors have the 'filter' method,
     as process, this method can return any sync value or a promise, on this example we returns
     a boolean value.
     A message pass through the filter when:
      - it returns true or returns any truthy value
      - it resolves a promise with true or any truthy value
      A message is rejected by the filter when:
       - it returns false or returns any falsy value
       - it resolves a promise with false or returns any falsy value
       - it throws an exception
       - it rejects a promise
  */
  filter: function(body, headers, sender, receiver) {
    return body>0; // As said before, you can also return a promise for async
  }
});
```

One important thing, you can also use to filter based on headers or on the sender, so its possible to use it to keep your actor private to your module (you just have to keep an namespace on all your modules actor id, 'myModule_myActor' for instance, and check the sender for it).

Streams
========

As said before Studio uses Baconjs so you can use it to add any kind of transformation supported by Baconjs (like, buffer, map, throttling...). And its really easy to use it (you can see examples of buffer on examples folder, using any other transformation follows the same pattern)

```js
//Here we apply a map transformation
myActor.addTransformation(function(stream) {
  return stream.map(function(message) {
    message.body = 'HELLO';
    return message;
  });
});
```

Timeouts
========

Studio also supports timeouts and is really easy to use.
When a actor sends a message to another actor you just have to do:

```js
senderActor.send('receiverActorId',{foo:'bar'});
```

To add a timeout to the message all you have to do is:

```js
var timeout = 1000;//1000 ms or 1 seg
senderActor.sendWithTimeout(timeout,'receiverActorId',{foo:'bar'});
````

And if your message is not processed in <<timeout>> milisseconds the promise is going to be cancelled and fail.

Generators
========

If you use generators to control your system flow, you can also use Studio to it, and its incredibly simple the whole code can be seen in koa examples:

```js
 new Studio.Actor({
  id: 'chainActorCo',
  initialize:function(opt){
    //Wrap process function using co library, this way we can use yield and write cleaner code with generators
    this.process = co.wrap(opt.process);
  },
  //On this case we define process function as a generator, so we can use yield keyword
  process: function*(body, headers, sender, receiver) {
    var messageToChainActor1 = 'actorCo -> ';
    console.log('Received message to actor = ' + chainActorCo.id);
    /*
      As you can see the called actor (chainActor1) don't need any changes, so we can
      communicate to actors using co or regular (non-co) actors without any changes, i.e.
      we dont have to worry about the implementation of other actors, you can use Co, or any
      generators/promise flow-control lib without any changes on your regular actors
    */
    return yield this.send('chainActor1', messageToChainActor1);
  }
});
```

Plugins
========

Studio also makes easy to add plugin to enhance the usage. Plugins can listen to actors or drivers creation and destruction and also intercept all messages sent. By now we only have the [studio-timer plugin](https://github.com/onstagejs/studio-timer), this plugin calculate the time elapsed in all send messages. We also plan to implement a automatic discovery plugin, so, soon you will be able to deploy and redeploy your actor in multiple instances and keep the communication working with ZERO configuration.

Zero downtime reload
========

Studio can listen to modification on your actors and reload it whenever anything changes, without the need to stop the application. By deafult, this feature is disabled and you have to enable it for each of your actors separetely. To do this just add a property <<watchPath:__filename>> on your actor on creation
```js
new Studio.Actor({
  id:'id',
  watchPath:__filename,
  process:function(){}
});
```

Pro tips
========

- The most important tip is LEARN HOW TO DEAL WITH A+ PROMISES, i think this [blog](https://blog.domenic.me/youre-missing-the-point-of-promises/) have a incredible explanation of what A+ promises means and how it saves you from callback hell
- Studio uses [Baconjs](https://github.com/baconjs/bacon.js) streams to deliver messages, so use it, to filter , map,buffer and apply different transformations to your messages. Baconjs is a powerful tool to keep your code clean, you use it to keep your validations and non-functional requisites away from your actor process function. This way your actor will be more easy to read, mantainable and testable.
- All your actor must be [idempotent](http://en.wikipedia.org/wiki/Idempotence) , Studio helps you to achieve this delivering to each actor a copy of the original message. Stop keep states on your code.
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

License
========

The MIT License (MIT)

Copyright (c) 2015 Erich Oliveira [ericholiveira.com](http://ericholiveira.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
