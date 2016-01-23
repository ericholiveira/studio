var fs = require('fs');
var _getCallerFile=function (){
    try{
        var err = new Error();
        return err.stack.split('\n')[3].match(/\(.*\)/g)[0].split(':')[0].substring(1);
    }catch(e){
        return '';
    }
};
module.exports = function(options){
    options.onStart(function(serv,ref){
        ref.watch = function(path){
            path = path || _getCallerFile();
            var watcher = fs.watch(path, function () {
                watcher.close();
                ref.stop();
                delete require.cache[path];
                require(path);
            });
            return ref;
        };
    });
};

