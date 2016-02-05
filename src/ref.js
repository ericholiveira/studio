var router = require('./router');
module.exports =  function (receiver) {
    receiver = typeof receiver === "string" ? {sender: null, receiver: receiver} : receiver;
    var result = function(){
        var _args = [].slice.call(arguments);
        return router.send.apply(router,[receiver.sender, receiver.receiver].concat(_args));
    };
    result.id = receiver.receiver;
    return result;
};