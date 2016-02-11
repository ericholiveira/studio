var router = require('./router');
module.exports =  function (receiver) {
    var result = router.send(receiver);
    result.id = receiver;
    return result;
};
