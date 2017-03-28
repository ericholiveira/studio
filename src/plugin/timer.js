/*jshint -W054 */
var logging= require('../logging');
var isNode=new Function("try {return this===global;}catch(e){return false;}");
var calculateResult = function(start,receiver,err){
  "use strict";
    var end = process.hrtime(start);
    return {
        time:(end[0] * 1e9 + end[1]) / 1e6,
        receiver:receiver,
        err:err
    };
};
module.exports = function(fn) {
  "use strict";
    return function (options) {
      if(isNode){
        options.onStart(function (serv) {
          logging.instance.log('Plugin: creating plugin timeout');
          var _fn = serv.fn;
          serv.fn = function(){
            var start = process.hrtime();
            return _fn.apply(serv,arguments).then(function (res) {
              fn(calculateResult(start,serv.id));
              return res;
            }).catch(function(err){
              fn(calculateResult(start,serv.id,err));
              throw err;
            });
          };
        });
      }
    };
};
