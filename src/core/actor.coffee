router = require('./router')
class Actor
  constructor: (options) ->
    {@id,@process,@stream} = options
    router.registerActor(this)
  sendMessage: (receiver,message)->
    router.sendMessage(@id,receiver,message)

module.exports = Actor
