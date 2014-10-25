router = require('./router')
class Actor
  constructor: (options) ->
    {@id,@process} = options
    @stream = router.getOrCreateRoute(@id)
    @unsubscribe = @stream.onValue(@doProcess)
  doProcess:(message) =>
    _doProcess=(message) =>
      {sender,body,receiver,callback} = message
      try
        result=@process(body,sender,receiver)
        if result and Q.isPromiseAlike(result)
          result.then((result)->callback(undefined,result)).catch((err)->callback(err or new Error('Unexpected Error')))
        else
          callback(undefined,result)
      catch err
        callback(err)
    if message?.length
      _doProcess(_message) for _message in message
    else
      _doProcess(message)
  addTransformation:(funktion)->
    @unsubscribe()
    @stream = funktion(@stream)
    @unsubscribe = @stream.onValue(@doProcess)
  send: (receiver,message)->
    router.send(@id,receiver,message)

module.exports = Actor
