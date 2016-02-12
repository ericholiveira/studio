var services = {};
var originalFns = {};
module.exports = function(mockito){
  "use strict";
    return function(options,Studio){
      "use strict";
        mockito.studio = {
            mock:function(id){
              "use strict";
                var service = services[id];
                if(!originalFns[id]){
                    originalFns[id] = service.fn;
                }
                var _mock = mockito.mockFunction();
                service.fn = Studio.promise.method(_mock);
                return _mock;
            },
            spy:function(id){
              "use strict";
                var service = services[id];
                if(!originalFns[id]){
                    originalFns[id] = service.fn;
                }
                var _mock = mockito.spy(service.fn);
                service.fn = Studio.promise.method(_mock);
                return _mock;
            },
            clean:function(id){
              "use strict";
                var service = services[id];
                service.fn = originalFns[id];
                delete originalFns[id];
            },
            cleanAll:function(){
              "use strict";
                Object.keys(originalFns).forEach(function(opt){
                    services[opt].fn = originalFns[opt];
                });
            }
        };
        options.onStart(function(service,ref){
          "use strict";
            services[service.id] = service;
        });
        options.onStop(function(service,ref){
            delete services[service.id];
        });
    };
};
