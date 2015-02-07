Bacon = require('baconjs')
router = require('./router')
BaseClass = require('./util/baseClass')
Promise = require('bluebird')

# Base class for all drivers.
class Driver extends BaseClass
  # Constructs a new Driver
  # @param [Object] options the driver options
  # @option options [Function] parser a function who receives an input and parse it to the format {sender:sender , receiver: receiver ,message:message}
  # @option options [Function] initialize function called after driver creation
  constructor: (options) ->
    @[property] = options[property] for property of options
    throw new Error('You must provide a parser function') if not @parser
    @initialize?(options)
  # Takes the arguments (i.e request,response on http requests or other arguments for different communication protocols / framework), parses it, and then sends the message to the right actor
  # @param [Arguments] args the arguments to build the message
  send: (args...)->
    Promise.attempt(()=>@parser(args...)).then((result)->
      {sender,receiver,body,headers}=result
      router.send(sender,receiver,body,headers)
    )


module.exports = Driver
