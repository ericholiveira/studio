# Class for internal use
class StudioStream
  # Default constructor
  constructor:()->
  # Simulates push
  push:(message)->@_onValue(message)
  # Executes on push message
  onValue:(fn)->
    @_onValue=fn
    ()->

module.exports = StudioStream
