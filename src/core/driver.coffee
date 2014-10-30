Bacon = require('baconjs')
router = require('./router')
BaseClass = require('./util/baseClass')

class Driver extends BaseClass
  constructor: (options) ->
    {@parser} = options
  send: (sender,receiver,message)->
    router.send(sender,receiver,message)

module.exports = Driver
