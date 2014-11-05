# Namespace
_global = window or {}
oldBroadway = _global.Broadway
module.exports=_global.Broadway={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  # Change the global Broadway to the previous to avoid conflicts
  noConflict:()->
    Broadway =  _global.Broadway
    if typeof oldBroadway!='undefined'
      _global.Broadway=oldBroadway
    else
      delete _global.Broadway
    return Broadway
}
