var _global = window || {};
var oldBroadway = _global.Broadway;
module.exports=_global.Broadway={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  noConflict:function(){
    var Broadway =  _global.Broadway;
    if(typeof oldBroadway!=='undefined'){
      _global.Broadway=oldBroadway;
    }else{
      delete _global.Broadway;
    }
    return Broadway;
  }
};
