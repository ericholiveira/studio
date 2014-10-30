# Cross-enviroment enqueue
Timer = {
  # Enqueue a function (uses proccess.nextTick on node and setTimeout on browsers)
  # @param [Function] funktion the enqueued function
  enqueue:(funktion)->
    if proccess?.nextTick?
      proccess.nextTick(funktion)
    else
      setTimeout(funktion,0)
}
module.exports = Timer
