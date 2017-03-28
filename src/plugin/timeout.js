var logging= require('../logging');
module.exports = function(options){
  "use strict";
    options.onStart(function(serv,ref){
        logging.instance.log('Plugin: creating plugin timeout');
        ref.timeout = function(ts){
          logging.instance.log('Plugin: timeout instantiation');
          var _fn = serv.fn;
          serv.fn = function(){
                var body = [].slice.call(arguments);
                return _fn.apply(serv,body).timeout(ts);
            };
            return ref;
        };
    });
};
