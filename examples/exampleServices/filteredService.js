var Studio = require('../../src/studio');



Studio(function filteredService(body){
  console.log(this.id + ' was called');
  return 'Hello ' + body;
}).filter(function(body){
  /* Let's say you have a rule where the username needs to start with lower case 'e'
     or the username is rejected. You could implement this logic on service
     function, but a better approach would be to keep your filter logic away from
     your business logic code. So all services have the 'filter' method,
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
  var filterResult = (body.charAt(0) === 'e');
  return filterResult;
});
