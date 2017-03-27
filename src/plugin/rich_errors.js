var logging= require('../logging');
module.exports = function(fn) {
  "use strict";
  return function (options) {
      logging.instance.log('Plugin: creating plugin rich_errors');
      options.onStart(function (serv) {
          logging.instance.log('Plugin: rich_errors instantiation');
          var _fn = serv.fn;
          serv.fn = function(){
            var args = arguments;
            return _fn.apply(serv,args).catch(function (err) {
              err._timestamp = Date.now();
              err._params = [].slice.call(args);
              throw err;
            });
          };
      });
  };
};
