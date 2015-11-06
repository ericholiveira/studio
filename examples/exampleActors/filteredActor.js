var Studio = require('../../compiled/core/studio');



var userActor = Studio.Actor({
  id: 'helloActorFiltered',
  process: function(body, headers, sender, receiver) {
    console.log('Received message to actor = ' + userActor.id);
    return 'Hello ' + body;
  },
  /* Let's say you have a rule where the username needs to start with lower case 'e'
     or the username is rejected. You could implement this logic on userActor 'process'
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
    var filterResult = (body.charAt(0) === 'e');
    return filterResult;
  }
});
