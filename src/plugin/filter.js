var _Promise = require('bluebird');
var exceptions = require('../exception');
var generatorUtil = require('../util/generator');
module.exports = function(options){
  "use strict";
    options.onStart(function(serv,ref){
        ref.filter = function(filter_fn){
            var _fn = serv.fn;
            filter_fn = generatorUtil.toAsync(filter_fn);
            serv.fn = function(){
                var body = [].slice.call(arguments);
                return filter_fn.apply(serv,body).then(function(filter_res){
                    if(filter_res){
                        return _fn.apply(serv,body);
                    }else{
                        throw exceptions.FilteredMessageException(serv.id);
                    }
                });
            };
            return ref;
        };
    });
};
