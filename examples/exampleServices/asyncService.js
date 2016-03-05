var Studio = require('../../src/studio');
Studio(function asyncService() {
  //Now we're going to return a delayed promise
  console.log(this.id + ' was called');
  return new Studio.promise(function(resolve, reject) {
    setTimeout(function() {
      //Wait 5 senconds before resolve the promise
      resolve('Hello World Delayed!!!');
    }, 5000);
  });
});