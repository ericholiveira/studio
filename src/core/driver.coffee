Bacon = require('baconjs')
router = require('./router')
class Driver
  constructor: (options) ->
    {@parser} = options
  send: (sender,receiver,message)->
    router.send(sender,receiver,message)

module.exports = Driver
