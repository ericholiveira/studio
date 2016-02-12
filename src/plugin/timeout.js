module.exports = function(options){
  "use strict";
    options.onStart(function(serv,ref){
      "use strict";
        var _fn = serv.fn;
        ref.timeout = function(ts){
          "use strict";
            serv.fn = function(){
              "use strict";
                var body = [].slice.call(arguments);
                return _fn.apply(serv,body).timeout(ts);
            };
            return ref;
        };
    });
};
