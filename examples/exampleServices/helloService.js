var Studio = require('../../src/studio');

Studio(function helloService() {
    /*
    When Studio receives a NAMED function it will create a service with that name.
    As stated before the since the decoupled nature of Studio you dont need to export a service
    */
    console.log(this.id + ' was called');
    return 'Hello World!!!';
  }
);