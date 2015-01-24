//Getting started comments on hello.js file
var Studio = require('../../compiled/core/studio');
var app = require('./app');
var driver = new Studio.Driver({
  initialize: function () {
    app.get('/exception', function (req, res) {
      driver.send(req, res).then(function (message) {
        res.send(message);
      }).catch(function(message){
        res.send('Sorry, try again later => '+ message);
      });
    });
  },
  parser: function (req, res) {
    return {
      sender: null,
      receiver: 'helloActorException',
      body: null,
      headers: null
    };
  }
});
var exc = new Studio.Actor({
  id: 'helloActorException',
  process: function (body, headers, sender, receiver) {
    /*Throw an error, the 'catch' method of the promise returned to the driver
    is going to be executed
    */
    console.log('Received message to actor = ' + exc.id);
    throw new Error('Some error occurred!!!');
  }
});
