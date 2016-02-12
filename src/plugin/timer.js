var calculateResult = function(start,receiver,err){
  "use strict";
    var end = Date.now();
    return {
        time:end - start,
        receiver:receiver,
        err:err
    };
};
module.exports = function(fn) {
  "use strict";
    return function (options) {
      "use strict";
        options.onStart(function (serv) {
          "use strict";
            var _fn = serv.fn;
            serv.fn = function(){
              "use strict";
              var start = Date.now();
              return _fn.apply(serv,arguments).then(function (res) {
                "use strict";
                fn(calculateResult(start,serv.id));
                return res;
              }).catch(function(err){
                "use strict";
                fn(calculateResult(start,serv.id,err));
                throw err;
              });
            };
        });
    };
};
