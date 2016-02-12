module.exports = function(options){
  "use strict";
    options.onStart(function(serv,ref){
        var _fn = serv.fn;
        ref.timeout = function(ts){
            serv.fn = function(){
                var body = [].slice.call(arguments);
                return _fn.apply(serv,body).timeout(ts);
            };
            return ref;
        };
    });
};
