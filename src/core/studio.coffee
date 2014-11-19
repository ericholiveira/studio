factories = require('./actorFactory')
# Namespace
_global = @ or {}
oldStudio = _global.Studio
module.exports=_global.Studio={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  actorFactory :factories.actorFactory,
  interceptorFactory :factories.interceptorFactory,
  Q:require('q'),
  Bacon:require('baconjs'),
  # Change the global Studio to the previous to avoid conflicts
  noConflict:()->
    if typeof oldStudio!='undefined'
      _global.Studio=oldStudio
    else
      delete _global.Studio
    return @
}
