var Studio = require('../../src/studio');

Studio(function chainService2(body){
  console.log(this.id + ' was called');
  return body + 'service2';
});
