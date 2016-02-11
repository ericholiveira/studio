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
        options.onCall(function () {
            var _args = arguments;
            var start = new Date().getTime();
            return this.next.apply(this,arguments).then(function (res) {
                fn(calculateResult(start,_args[_args.length-1]));
                return res;
            }).catch(function(err){
                fn(calculateResult(start,_args[_args.length-1],err));
                throw err;
            });
        });
    };
};
