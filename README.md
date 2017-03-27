Studio.js
=========

<img src="http://ericholiveira.com/studio/images/STUDIO_logo.png" align="right" width="300px" />

Micro services framework for Nodejs.

Studio is a lightweight framework for node development to make easy to create reactive applications according to [reactive manifesto](http://www.reactivemanifesto.org/) principles. It uses micro-services (freely inspired by akka/erlang actors) implemented using [bluebird](https://github.com/petkaantonov/bluebird) a+ promises (or generators async/await) to solve the callback hell problem.

Do you want clusterization? Realtime metrics? Easy async programming? Completely decoupled services? Stop worrying about throwing exceptions? Then I've  built this framework for you, because node needs a framework easy to use, yet giving your powerful features like realtime metrics and clusterization with no configuration (service discovery + rpc). Other frameworks relies on "actors", "commands", "brokers" and a lot of other complicated concepts, studio deals only with functions and promises, if you know both concepts you're ready to use and master it.

The main goal is to make all systems responsive, fault tolerant, scalable and maintainable. The development with Studio is (and always will be) as easy as possible, i'll keep a concise api, so other developers can create (and share) plugins for the framework.

The plugin system and the decoupled nature of it enables you to have real time metrics in your services , [ZERO CONFIGURATION CLUSTERIZATION ON DISTRIBUTED MACHINES](#cluster) and other improvements for your services.

Studio isn't only a library, it's a framework. It's really important to learn how to program and not only what each method can do.

I would love to receive feedback.Let me know if you've used it. What worked and what is wrong. Contribute and spread the word.


Wants to learn more???? Click here to join our slack channel 

[![Join the StudioJS chat](https://studiojs.herokuapp.com/badge.svg)](https://studiojs.herokuapp.com/)

[![Build Status](https://travis-ci.org/ericholiveira/studio.svg?branch=master)](https://travis-ci.org/ericholiveira/studio)
[![npm version](https://badge.fury.io/js/studio.svg)](http://badge.fury.io/js/studio)
[![Dependency Status](https://david-dm.org/ericholiveira/studio.svg)](https://david-dm.org/ericholiveira/studio)

[![NPM](https://nodei.co/npm/studio.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/studio/)

Table of contents
========

- [Install](#install)
- [Intro](#intro)
- [Why](#why)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Modules / namespacing](#modules)
- [Co / Generators and flow-control](#generators)
- [Proxy](#proxy)
- [Es6 Class](#es6-class)
- [Plugins](#plugins)
- [Filters](#filters)
- [Timeouts](#timeouts)
- [Realtime metrics](#realtime-metrics)
- [Retry](#retry)
- [Clustering](#cluster)
- [Pro tips](#pro-tips)
- [From Zero To Hero](#from-zero-to-hero)
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

We all want our systems to be responsive, scalable, fault tolerant, maintainable and for the last, but not least, easy and fun to develop. With this goals in mind i decided to build a [micro-services](http://martinfowler.com/articles/microservices.html) framework for nodejs using and architecture freely inspired on [actors model](http://en.wikipedia.org/wiki/Actor_model). I present you [Studio](https://github.com/ericholiveira/studio)

Studio makes easy to create code without ANY dependency between your services, so you can deploy all in a single machine or just easily change to each one in a different machine or anything in between. It also enables operations timeouts, zero-downtime reload, let-it-crash approach (stop to be afraid of exceptions, Studio handles it to you), plugins and makes it nearly impossible to falls in a callback hell. Supports any web framework (we have examples with express) and helps you with flow-control using [bluebird](https://github.com/petkaantonov/bluebird).

Studio encourages you to use the best practices of nodejs, it helps you to write simple, clean and completely decoupled code. And makes it very easy and fun.

First of all, everything in a Studio-based application is a service.

So if you're used to build SOA or micro-services all your services (and possible layers, as DAOs for instance) are going to be declared as a STATELESS SINGLETON services. Services have an unique identifier and communicate (always) asynchronously through message passing. The benefits of this approach is that it is really easy to take just some of your services to different servers and make a better use of it. Also, your services have the free benefit of deep copying the parameters before the message is delivered (so one service can't mess with the objects of another service) increasing your code security.

And this is it... this is all you need to create [reactive](http://reactivemanifesto.org) applications.

Why
========

Now you might be wondering why systems created with Studio can be called a reactive system. As stated by the [reactive manifesto](http://www.reactivemanifesto.org/), reactive systems are those who follow 4 principles:

- Responsive : 
> Responsive systems focus on providing rapid and consistent response times, establishing reliable upper bounds so they deliver a consistent quality of service.

Using Studio you just add a thin layer over your functions without compromising the responsiveness while giving you the power to interact with your application in runtime as in [aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)

- Resilient :
> The system stays responsive in the face of failure. This applies not only to highly-available, mission critical systems any system that is not resilient will be unresponsive after a failure. 

This is critical for thoses using nodejs, Studio enforces you to use the best practices to avoid your process or any of workers to crash. And as all your services are written with async flow in mind it also makes easy to add redundance

- Elastic : 
> The system stays responsive under varying workload.

This is critical for Studio. All service calls are async so you never release [zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony), also every service call receives a copy of the parameters so a service cant mess with other service code. And for the last but not least using Studio plugins you can have measures of your code in realtime as using the [timer plugin](#timer) you can check the time needed to execute every single service call in your application and you can even send it easily for a statsd/grafana metrics dashboard. So this way you have an application ready to scale horizontally and also with the metrics to help you to decide when to do this.

- Message driven :
> Reactive Systems rely on asynchronous message-passing to establish a boundary between components that ensures loose coupling, isolation, location transparency, and provides the means to delegate errors as messages.

All service calls in Studio are async, even if youre doing some sync code, Studio will make it run async. Also all call goes through the Studio router which enforces a deep clone of the parameters for security reasons, and all services are COMPLETELY DECOUPLED and isolated from each other

So the main reason to use Studio is because it makes it to reason about your code and make it scalable as hell.

Getting Started
========

To create a service all you need to do is pass a NAMED function to studio

```js
var Studio = require('studio');
Studio(function myFirstService(){
   return 'Hello World';
});
```

To call a service all you need to do is pass the identifier of a service to studio (remember all service calls returns a promise)

```js
var Studio = require('studio');
var myFirstServiceRef = Studio('myFirstService');
myFirstServiceRef().then(function(result){
	console.log(result); //Prints Hello World 
});
```

Your service can receive any number of arguments.
And also, you can get a reference to a service even if it was not instantiated yet (you only need it when calling) as in:


```js
var Studio = require('studio');
//Get the reference for a non initialized service works perfectly
var myServiceNotInstantiatedRef = Studio('myServiceNotInstantiated');

Studio(function myServiceNotInstantiated(name){
	return 'Hello '+name;
});
myServiceNotInstantiatedRef('John Doe').then(function(result){
	console.log(result); //Prints Hello John Doe 
});
```

Is that simple to run over Studio. No boilerplate required.

Now the things can get more interesting if youre running on node >= 4 or using the flag --harmony-generators, because studio supports generators out-of-the-box if they are available as in:

```js
var Studio = require('studio');
var myFirstServiceRef = Studio('myFirstService');
Studio(function myFirstService(){
   return 'Hello World';
});

Studio(function * myFirstServiceWithGenerator(result){
	var message = yield myFirstServiceRef();
    console.log(message); // Prints Hello World
   	return message + ' with Generators';
});
var myFirstServiceWithGeneratorRef = Studio('myFirstServiceWithGenerator');
myFirstServiceWithGeneratorRef().then(function(result){
	console.log(result); //Prints Hello World with Generators
});
```

You can yield Promises, Arrays of promises (for concurrency), Regular Objects or even Thunkable (node callbacks) you can see hthe examples in the [generators](#generators) session
 
Also if youre running on node >= 6 or using the flag and --harmony-proxies. You can access the services easier:

```js
var Studio = require('studio');
//Get a reference to all services, even those not created yet
// So magical :)
var allServices = Studio.services();

Studio(function myFirstService(){
   return 'Hello World';
});

Studio(function * myFirstServiceWithGenerator(result){
	var message = yield allServices.myFirstService();
    console.log(message); // Prints Hello World
   	return message + ' with Generators';
});

allServices.myFirstServiceWithGenerator().then(function(result){
	console.log(result); //Prints Hello World with Generators
});
```

You can enable Studio logs via environment variable:
```bash
DEBUG=Studio node my-studio-app.js
```


Examples
========

Follow the link to see all available [examples](https://github.com/ericholiveira/studio/tree/master/examples)

Studio works with any web framework.

Here i'm going to put just a basic hello world with express, on [examples](https://github.com/ericholiveira/studio/tree/master/examples) folder you can see the best practices and more practical examples ( with promises, errors, filters...):
```js
var express = require('express');
var Studio = require('studio'); //require Studio namespace
var app = express(); // create an express app

//Gets reference to helloService
var helloService = Studio('helloService');
//If you pass a String to Studio function it returns a reference for that service

app.get('/', function(req, res) {
  /* When this route is requested we send the message to the responsible
   service using the 'helloService' function, all references returns a promise
   when the promise is fulfilled the 'then' method is executed, if it is
   rejected the 'catch' method is executed
   */
  helloService().then(function(message) {
    res.send(message);
  }).catch(function(message) {
    res.send('Sorry, try again later => ' + message);
  });
});
//Create a service

Studio(function helloService() {
    /*
    When Studio receives a NAMED function it will create a service with that name.
    As stated before the since the decoupled nature of Studio you dont need to export a service
    */
    console.log(this.id + ' was called');
    return 'Hello World!!!';
  }
);
app.listen(3000);// Listen on port 3000
```

On examples folder you can learn how to deal with errors, filter messages and much more.

Modules
========

Studio have a built-in module system to prevent service identifier collision and it is insanely easy to use, all you have to do is prepend Studio calls with Studio.module("someModuleName")

```js
var Studio = require('studio'); //require Studio namespace
var helloModule = Studio.module('hello');//Creates hello module

//Creates service under hello module
helloModule(function say(){
	return 'hello';
});

/*
Modules object have all the properties from Studio, but running only for that module
so  helloModule('say'); return a reference to the service 'say' inside the module hello
*/
var sayService = helloModule('say');

Studio(function someServiceOnRootModule(){
	return sayService();
});

var someServiceOnRootModuleRef = Studio('someServiceOnRootModule');

someServiceOnRootModuleRef().then(function(result){
	console.log(result);
});

```


Generators
========

Studio supports generators out-of-the-box if they are available (only available for node >4 or older versions running with --harmony-generators flag) as in:

```js
var Studio = require('studio');
var myFirstServiceRef = Studio('myFirstService');
Studio(function myFirstService(){
   return 'Hello World';
});

Studio(function * myFirstServiceWithGenerator(result){
	var message = yield myFirstServiceRef();
    console.log(message); // Prints Hello World
   	return message + ' with Generators';
});
var myFirstServiceWithGeneratorRef = Studio('myFirstServiceWithGenerator');
myFirstServiceWithGeneratorRef().then(function(result){
	console.log(result); //Prints Hello World with Generators
});
```

You can yield Promises, Arrays of Promises, Objects, and even callbacks using Studio.defer().

Examples:

```js
var Studio = require('studio');
var myFirstServiceRef = Studio('myFirstService');
Studio(function myFirstService(){
   return 'Hello World';
});
//Yielding promise
Studio(function * myWithGeneratorYieldsPromise(result){
	var message = yield myFirstServiceRef();
    console.log(message); // Prints Hello World
   	return message + ' with Generators';
});
//Yielding array
Studio(function * myWithGeneratorYieldsArray(result){
	var message = yield [myFirstServiceRef(),myFirstServiceRef()];
    console.log(message[0]); // Prints Hello World
    console.log(message[1]); // Prints Hello World
   	return message[0] + ' with Generators';
});

//Yielding Object
Studio(function * myWithGeneratorYieldsObject(result){
	var message = yield 'Hello World';
    console.log(message); // Prints Hello World
   	return message + ' with Generators';
});

var fs = require('fs');
//Yielding Callback
Studio(function * myWithGeneratorYieldsObject(result){
	// just place Studio.defer() instead of the callback function
	var message = yield fs.readFile('SOME_FILE_NAME',Studio.defer());
    console.log(message); // Prints the file content
   	return message + ' with Generators';
});
```

Proxy
========

If youre running on node > 4 or using --harmony-proxies flag. You can access the services easier:

```js
var Studio = require('studio');
//Get a reference to all services, even those not created yet
// So magical :)
var allServices = Studio.services();

Studio(function myFirstService(){
   return 'Hello World';
});

Studio(function * myFirstServiceWithGenerator(result){
	var message = yield allServices.myFirstService();
    console.log(message); // Prints Hello World
   	return message + ' with Generators';
});

allServices.myFirstServiceWithGenerator().then(function(result){
	console.log(result); //Prints Hello World with Generators
});
```

Es6 Class
========

If you're running on node >=4 or using --harmony flag, you can create your services easier:
```js
var Studio = require('studio');
class Foo{
	bar(){
		return this.hello();
	}
	hello(){
		return 'hello';
	}
	useExternal(){
		var someExternalService = Studio('someExternalService');
		return someExternalService();
	}
}
Studio.serviceClass(Foo);

//To acess from outside or other classes
var fooModule = Studio.module('Foo');
var barService = fooModule('bar');
barService();
```

This way Studio automatically creates a namespace with the class name and a service for each function of this class

Plugins
========

Plugins lets you have full control of whats going on with your services, this way you can enhance your services with a lot of cool capabilities like realtime metrics, timeout and any other cool stuff if you decide to create your own plugins. To use a plugin all you have to do is:

```js
	Studio.use(MY_SUPER_COOL_PLUGIN);
```

Plugins can listen to services creation and destruction(this way you can intercept messages). The officially maintained plugins are available under Studio.plugin parameter. You can check the [tests folder](https://github.com/ericholiveira/studio/tree/master/tests) to understand better how to use plugins.

Studio.use method also receives an optional second parameter to filter the services that are going to receive the plugin this filter can be a string (to match only the service with that name), a regular expression, an array of strings or a function as:

```js
	Studio.use(MY_SUPER_COOL_PLUGIN_1, 'myService');
    Studio.use(MY_SUPER_COOL_PLUGIN_2, /myService/g);
    Studio.use(MY_SUPER_COOL_PLUGIN_3, ['myService1','myService2']);
    Studio.use(MY_SUPER_COOL_PLUGIN_4, function(serviceId){
    	return serviceId === 'myService';
    });
```

Filters
========

Validation and filters are a common use for your services, so Studio already make it as a built-in resource. Any service can have a "filter" function to handle this (if you know [guards](https://en.wikipedia.org/wiki/Guard_(computer_science)) or asserts you know what a filter is). As any other action on Studio, it already deals with async or sync results automatically.

```js
Studio(function helloFiltered(value){
	console.log('Received message to actor = ' + userActor.id);
    return 'Hello';
}).filter(function(value){
  /* Let's say you have a rule where the body needs to be greater than 0.
  You could implement this logic on helloFiltered
  function, but a better approach would be to keep your filter logic away from
  your business logic code. So all services have the 'filter' method, this method can return any 
  sync value or a promise, on this example we returns a boolean value.
  A message pass through the filter when:
  - it returns true or returns any truthy value
  - it resolves a promise with true or any truthy value
  A message is rejected by the filter when:
  - it returns false or returns any falsy value
  - it resolves a promise with false or returns any falsy value
  - it throws an exception
  - it rejects a promise
  */
	return value>0; // As said before, you can also return a promise for async
});
```

Timeouts
========

Studio also supports timeouts and is really easy to use.
You can easily make sure that a service is going to respond in a timeframe or it fails, to do this, you will need to add the timeout plugin:

```js
Studio.use(Studio.plugin.timeout);
Studio(function myServiceWithTImeout(){
	var randomTime = Math.floor(Math.random()*100);
    return Studio.promise.delay(randomTime);
}).timeout(50);//Time in milliseconds
```

Real time metrics
=================

One of the cool things you can do with Studio plugins is to have real time metrics of all your services, if you want to log
the time needed to execute every call of every service you can do it easily with the timer plugin. This plugin also
shows you the power you can get from a custom plugin and [aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)

The timer plugin uses process.hrtime() for sub-millisecond precision.

```js
var Studio = require('studio');

Studio.use(Studio.plugin.timer(function(res){
    /*
     * Here you define what to do with the execution info, now we are going just to print in the console, but
     * in production you could send it to statsd or some other metric aggregator.
     */
    console.log('The receiver %s took %d ms to execute', res.receiver, res.time);
}));

Studio(function myService(){
	var randomTime = Math.floor(Math.random()*100);

    // Time in milliseconds
    return Studio.promise.delay(randomTime);
});

var myServiceRef = Studio('myService');

setInterval(myServiceRef, 500);
```

Retry
=====

Studio supports retry a service call in the occurrence of error.

```js
var Studio = require('studio');

Studio.use(Studio.plugin.retry());

Studio(function myService(){
	throw new Error('');
}).retry({max:2});

var myServiceRef = Studio('myService');

setInterval(myServiceRef, 500);
```

It supports multiple configurations, and all can be applied for all services and overriden for individual services.

```js
var Studio = require('studio');

Studio.use(Studio.plugin.retry({max:3})); //set the service to retry 3 times as default 

Studio(function myService(){
	throw new Error('');
}).retry({max:2}); //set the service to retry 2 times

Studio(function myOtherService(){
	throw new Error('');
}).retry();//set the service to retry. Will use the default max attempts 

Studio(function yetAnotherService(){
	throw new Error('');
}); // this service will never retry (YOU MUST CALL .retry() to enable retry)

var myServiceRef = Studio('myService');

setInterval(myServiceRef, 500);
```


Name                | Description                                                                                                      | Default
--------------------|------------------------------------------------------------------------------------------------------------------|---------------
max                 | Number of retry attempts                                                                                         | 0
filter              | A function to filter certain errors from retry (must return a boolean)                                           | retry for all errors
initialInterval     | Interval between retries                                                                                         | 0
factor              | A multiplication factor between retries                                                                          | 1
beforeCall          | Function called BEFORE every service call, can be used to support stateful retries                               | -
afterCall           | Function called AFTER all retries, can be used to support stateful retries (called on both, success and failures | -

Cluster
========

To clusterize your application without any configuration you need to add the [studio-cluster](https://github.com/ericholiveira/studio-cluster) plugin, follow the link to see how to use and examples of implementations, like the [distributed merge sort](https://github.com/ericholiveira/studio-cluster/tree/master/examples/mergesort)

Pro tips
========

- The most important tip is LEARN HOW TO DEAL WITH A+ PROMISES, i think this [blog](https://blog.domenic.me/youre-missing-the-point-of-promises/) have a incredible explanation of what A+ promises means and how it saves you from callback hell
- You should avoid mutatins states , Studio helps you to achieve this delivering to each service a copy of the original message.

From Zero To Hero
========

I've also started a series of posts on my medium explaining the motivation and creating a small project with studio

[Nodejs microservices. From Zero to Hero Pt1 - Motivation](https://medium.com/@ericholiveira/nodejs-microservices-from-zero-to-hero-pt1-279548cb4080)

[Nodejs microservices. From Zero to Hero Pt2 - Basic Usage](https://medium.com/@ericholiveira/nodejs-microservices-from-zero-to-hero-pt2-72fbb2a1b1c4#.dpz6adn7c)

[Nodejs microservices. From Zero to Hero Pt3 - Plugins and cluster](https://medium.com/@ericholiveira/nodejs-microservices-from-zero-to-hero-pt1-plugins-and-clustering-ddb60e9a8ee0#.v3m1jh2l5)

Dependencies
========
Studio depends on:
- [bluebird](https://github.com/petkaantonov/bluebird) for a+ promises usage
- [harmony-proxy](https://github.com/Swatinem/proxy) to help with proxy usage on node 0.11 and 0.12 (if you want to enable it) 

Build
========

To build the project you have to run:

    npm install
    npm run start

This is going to install dependencies, lint and test the code

Test
========

Run test with:

    npm run test

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
