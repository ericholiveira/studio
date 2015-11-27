var router = require('./router');
module.exports =  function (receiver) {
    receiver = typeof receiver === "string" ? {sender: null, receiver: receiver} : receiver;
    return function(){
        var _args = [].slice.call(arguments);
        return router.send.apply(router,[receiver.sender, receiver.receiver].concat(_args));
    };
};