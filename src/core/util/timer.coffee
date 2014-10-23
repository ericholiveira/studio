Timer = {
  enqueue:(funktion)->
    if proccess?.nextTick?
      proccess.nextTick(funktion)
    else
      setTimeout(funktion)
}
module.exports = Timer
