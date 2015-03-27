clone = (obj) ->
  if not obj? or typeof obj isnt 'object' or Object.isFrozen(obj)
    return obj
  if obj instanceof Date
    return new Date(obj.getTime())
  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags)
  if obj instanceof Buffer
    newInstance = new Buffer(obj.length)
    obj.copy(newInstance)
    return Object.freeze(newInstance)
  if obj instanceof Array
    newInstance = (clone _obj for _obj in obj)
    return Object.freeze(newInstance)
  newInstance = new obj.constructor()
  for key of obj
    newInstance[key] = clone obj[key]
  return Object.freeze(newInstance)
module.exports = clone
