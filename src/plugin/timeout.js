module.exports = function(options){
  "use strict";
    options.onStart(function(serv,ref){
        ref.timeout = function(ts){
          var _fn = serv.fn;
          serv.fn = function(){
                var body = [].slice.call(arguments);
                return _fn.apply(serv,body).timeout(ts);
            };
            return ref;
        };
    });
};
