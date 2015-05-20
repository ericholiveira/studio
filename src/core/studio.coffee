# Namespace
Studio={
  router:require('./router'),
  Actor :require('./actor'),
  Driver :require('./driver'),
  Promise:require('bluebird'),
  Bacon:require('baconjs'),
  use : (plugin, args...)->
    plugin(Studio,args...)
}
module.exports=Studio
