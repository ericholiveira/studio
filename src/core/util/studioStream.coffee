class StudioStream
  constructor:()->
  push:(message)->@_onValue(message)
  onValue:(fn)->
    @_onValue=fn
    ()->

module.exports = StudioStream
