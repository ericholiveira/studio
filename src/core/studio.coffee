# Namespace
_global = window? and window or {}
oldStudio = _global.Studio
module.exports=_global.Studio={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  # Change the global Studio to the previous to avoid conflicts
  noConflict:()->
    Studio =  _global.Studio
    if typeof oldStudio!='undefined'
      _global.Studio=oldStudio
    else
      delete _global.Studio
    return Studio
}
