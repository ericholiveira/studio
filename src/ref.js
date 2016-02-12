var router = require('./router');
module.exports =  function (receiver) {
  "use strict";  
  var result = router.send(receiver);
    result.id = receiver;
    return result;
};
