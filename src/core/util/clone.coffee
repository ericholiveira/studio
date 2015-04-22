clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj
  if typeof obj.clone is 'function'
    return obj.clone()
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
    return newInstance
  if obj instanceof Array
    newInstance = (clone _obj for _obj in obj)
    return newInstance
  newInstance = new obj.constructor()
  for key of obj
    newInstance[key] = clone obj[key]
  return newInstance
module.exports = clone
