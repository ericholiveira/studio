var services = {};
var originalFns = {};
module.exports = function(mockito){
  "use strict";
    return function(options,Studio){
        mockito.studio = {
            mock:function(id){
                var service = services[id];
                if(!originalFns[id]){
                    originalFns[id] = service.fn;
                }
                var _mock = mockito.mockFunction();
                service.fn = Studio.promise.method(_mock);
                return _mock;
            },
            spy:function(id){
                var service = services[id];
                if(!originalFns[id]){
                    originalFns[id] = service.fn;
                }
                var _mock = mockito.spy(service.fn);
                service.fn = Studio.promise.method(_mock);
                return _mock;
            },
            clean:function(id){
                var service = services[id];
                service.fn = originalFns[id];
                delete originalFns[id];
            },
            cleanAll:function(){
                Object.keys(originalFns).forEach(function(opt){
                    services[opt].fn = originalFns[opt];
                });
            }
        };
        options.onStart(function(service,ref){
            services[service.id] = service;
        });
        options.onStop(function(service,ref){
            delete services[service.id];
        });
    };
};
