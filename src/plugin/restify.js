var swaggerInfo ={};
var paths = {};
var paramsDoc = [];
var startSwagger = function(swagger,server){
    swaggerInfo = swagger;
    swaggerInfo.swagger = '2.0';
    swaggerInfo.paths = paths;
    server.get('/documentation',function(req,res,next){
        res.send(swaggerInfo);
        next();
    });
};
var addPathToSwagger = function(opt){
    var helper = {};
    helper[opt.path] = {};
    helper[opt.path][opt.method] = opt.meta;
    paths[opt.path] = paths[opt.path] || helper[opt.path];
    paths[opt.path][opt.method] = helper[opt.path][opt.method];
    paths[opt.path][opt.method].parameters = paramsDoc;
};
var pluginFn = function(server,opt){
    var _errorHandler = opt.errorHandler || function(err,req,res,next){
        err = JSON.parse(JSON.stringify(err));
        res.send(err.statusCode || 500,err);
        return next(true);
    };
    startSwagger(opt.swagger,server);
    return function(options){
        options.onStart(function(service,ref){
            ref.restify = function(opt){
                opt.errorHandler = opt.errorHandler || _errorHandler;
                opt.method = (opt.method || 'GET').toLowerCase();
                opt.params = opt.params || [];
                opt.paramsDoc = paramsDoc;
                addPathToSwagger(opt);
                paramsDoc = [];
                server[opt.method](opt.path,function(req,res,next){
                    var i = 0,_len = opt.params.length;
                    var params = [];
                    var value;
                    for(;i<_len;i++){
                        value = opt.params[i](req);
                        if(value.validator) {
                            value = value.validator.validate(value.param);
                        }
                        if(value.error){
                            return opt.errorHandler(value.error,req,res,next);
                        }
                        params.push(value.value);
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
var addParamDoc = function(location,parameter,validator){
    if(validator && validator.isJoi){
        paramsDoc.push({
            "name": parameter,
            "in": location,
            "required": validator._flags.presence === 'required',
            "type": validator._type
        });
    }
};
pluginFn.pathParam = function(parameter,validator){
    addParamDoc('path',parameter,validator);
    console.log(validator);
    return function(req){
        return {param:req.params[parameter],validator:validator};
    };
};
pluginFn.bodyParam = function(parameter,validator){
    addParamDoc('body',parameter,validator);
    return function(req){
        return {param:req.body[parameter],validator:validator};
    };
};
pluginFn.queryParam = function(parameter,validator){
    addParamDoc('query',parameter,validator);
    return function(req){
        return {param:req.query[parameter],validator:validator};
    };
};
pluginFn.headerParam = function(parameter,validator){
    addParamDoc('header',parameter,validator);
    return function(req){
        return {param:req.headers[parameter],validator:validator};
    };
};

module.exports = pluginFn;

