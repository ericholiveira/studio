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
        options.onStart(function (serv) {
            var _fn = serv.fn;
            serv.fn = function(){
              var start = new Date().getTime();
              return _fn.apply(serv,arguments).then(function (res) {
                fn(calculateResult(start,serv.id));
                return res;
              }).catch(function(err){
                fn(calculateResult(start,serv.id,err));
                throw err;
              });
            };
        });
    };
};
