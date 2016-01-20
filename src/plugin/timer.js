var calculateResult = function(start,receiver,err){
    var end = new Date().getTime();
    return {
        time:end - start,
        receiver:receiver,
        err:err
    };
};
module.exports = function(fn) {
    return function (options) {
        options.onCall(function (message) {
            var start = new Date().getTime();
            return this.next(message).then(function (res) {
                fn(calculateResult(start,message.receiver));
                return res;
            }).catch(function(err){
                fn(calculateResult(start,message.receiver,err));
                throw err;
            });
        });
    };
};