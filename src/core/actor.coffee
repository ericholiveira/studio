
router = require('./router')
BaseClass = require('./util/baseClass')
Q = require('q')

# Base class for all actors.

class Actor extends BaseClass

  # Constructs a new actor
  # @param [Object] options the actor options
  # @option options [String] id actor id (should be unique), when you instantiate an actor you automatically create a stream on the router with this id
  # @option options [Function] process the process function which will be executed for every message
  # @example How to instantiate an actor (in Coffescript)
  #   myActor = new Actor({
  #               id: 'myActor',
  #               process:(body,sender,receiver)-> console.log(body)
  #             })
  constructor: (options) ->
    {@id,@process} = options
    @stream = router.getOrCreateRoute(@id)
    @unsubscribe = @stream.onValue(@doProcess)
  # PRIVATE METHOD SHOULD NOT BE CALLED
  # Takes a stream message and open it for the actor process function format. And creates a promise with the result of the message
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
  # Transform the message stream, so you can merge other streams, filter, buffer or do anything you can do with a baconjs stream
  # @param [Function] funktion a function which receives the current stream for this actor and return the new transformed stream
  # @example How to apply a filter transformation (in Coffescript)
  #   myActor.addTransformation((stream)->stream.filter((message)->message.sender == 'otherActor'))
  addTransformation:(funktion)->
    @unsubscribe()
    @stream = funktion(@stream)
    @unsubscribe = @stream.onValue(@doProcess)
  # Sends message to an actor
  # @param [String] receiver the receiver id
  # @param [Object] message the content of the message (it could be any js object)
  send: (receiver,message)->
    router.send(@id,receiver,message)
module.exports = Actor
