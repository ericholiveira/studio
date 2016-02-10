var swaggerInfo ={};
var paths = {};
var definitions = {};
var startSwagger = function(swagger,server){
    swaggerInfo = swagger;
    swaggerInfo.swagger = '2.0';
    swaggerInfo.paths = paths;
    swaggerInfo.definitions = definitions;
    server.get('/documentation',function(req,res,next){
        res.send(swaggerInfo);
        next();
    });
};
var addPathToSwagger = function(opt,paramsDoc){
    var helper = {};
    opt.path = "\""+opt.path.replace(/:([\w]*)/g,'{$1}')+"\"";
    helper[opt.path] = {};
    helper[opt.path][opt.method] = opt.meta;
    paths[opt.path] = paths[opt.path] || helper[opt.path];
    paths[opt.path][opt.method] = helper[opt.path][opt.method];
    paths[opt.path][opt.method].parameters = paramsDoc;
};
var createModel = function(modelName,fields){
    var i,properties={};
    if(definitions[modelName]){
        return;
    }
    definitions[modelName]={type:'object',properties:properties};
    for(i=0;i<fields.length;i++){
        definitions[modelName].properties[fields[i].key] = {
            type: fields[i].schema._type
        };
    }
};
var mapDocs = function(v){
    var type;
    var result = {
        name: v.parameter,
        in: v.location,
        required: v.validator._flags.presence === 'required'
    };
    if(v.validator && v.validator.isJoi){
        type = v.validator._meta && v.validator._meta[0] && v.validator._meta[0].type || v.validator._type;
        if(v.validator._type === 'object' && v.validator._type !== type ){
            createModel(type, v.validator._inner.children);
            result.schema = {$ref:'#/definitions/'+type};
        }else{
            result.type = type;
        }
        result.description = v.validator._description || '';
    }
    return result;
};
var pluginFn = function(server,opt){
    var _errorHandler = opt.errorHandler || function(err,req,res,next){
        err = JSON.parse(JSON.stringify(err));
        res.send(err.statusCode || 500,err);
        return next(true);
    };
    startSwagger(opt.swagger,server);
    return function(options,Studio){
        options.onStart(function(service,ref){
            ref.restify = function(opt){
                var paramsDoc;
                opt.errorHandler = opt.errorHandler || _errorHandler;
                opt.method = (opt.method || 'GET').toLowerCase();
                opt.params = opt.params || [];
                var validators = opt.params.map(function(v){
                    return v.validator;
                });
                paramsDoc = opt.params.map(mapDocs);
                addPathToSwagger(opt,paramsDoc);
                _fn = service.fn;
                service.fn=Studio.promise.method(function(){
                    var args = [].slice.call(arguments);
                    var i = 0,_len = Math.min(args.length,validators.length);
                    var value;
                    for(;i<_len;i++){
                        if(validators[i]){
                            value = validators[i].validate(args[i]);
                            if(value.error){
                                throw value.error;
                            }
                        }
                    }
                    return _fn.apply(service,args);
                });
                server[opt.method](opt.path,function(req,res,next){
                    var i = 0,_len = opt.params.length;
                    var params = [];
                    for(;i<_len;i++){
                        params.push(opt.params[i](req));
                    }
                    ref.apply(ref,params).then(function(result){
                        res.send(result);
                        next();
                    }).catch(function(error){
                        opt.errorHandler(error,req,res,next);
                    });
                });
                return ref;
            };
        });
    };
};
pluginFn.reqParam = function(parameter){
    var getter = function(req){
        return req[parameter];
    };
    return getter;
};
pluginFn.pathParam = function(parameter,validator){
    var getter = function(req){
        return req.params[parameter];
    };
    getter.location = 'path';
    getter.parameter = parameter;
    getter.validator = validator;
    return getter;
};
pluginFn.bodyParam = function(parameter,validator){
    var getter = function(req){
        return req.body;
    };
    getter.location = 'body';
    getter.parameter = parameter;
    getter.validator = validator;
    return getter;
};
pluginFn.queryParam = function(parameter,validator){
    var getter = function(req){
        return req.query[parameter];
    };
    getter.location = 'query';
    getter.parameter = parameter;
    getter.validator = validator;
    return getter;
};
pluginFn.headerParam = function(parameter,validator){
    var getter = function(req){
        return req.headers[parameter];
    };
    getter.location = 'header';
    getter.parameter = parameter;
    getter.validator = validator;
    return getter;
};

module.exports = pluginFn;

