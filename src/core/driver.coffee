Bacon = require('baconjs')
router = require('./router')
class Driver
  constructor: (options) ->
    {@parser} = options
  deliver: (sender,receiver,message)->
    router.sendMessage(sender,receiver,message)

module.exports = Driver
