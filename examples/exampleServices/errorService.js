var Studio = require('../../src/studio');

Studio(function errorService() {
    /*Throw an error, the 'catch' method of the promise returned to the caller
    is going to be executed
    */
  console.log(this.id + ' was called');
  throw new Error('Some error has occurred on errorService!!!');
});