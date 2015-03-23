# Deep clone an object (thx coffeescript cookbook) and make it immutable
# @param [Object] obj the object to be cloned
cloneAsConst = (obj)->
  if Object.isFrozen(obj)
    return obj
  tmp = obj.constructor()
  for property of obj
    value = obj[property]
    if typeof value is 'object' and value isnt null
      if value instanceof Date
        value = new Date(value.getTime());
      else
        if value instanceof RegExp
          flags = ''
          flags += 'g' if obj.global?
          flags += 'i' if obj.ignoreCase?
          flags += 'm' if obj.multiline?
          flags += 'y' if obj.sticky?
          value = new RegExp(value.source, flags)
        else
          value = cloneAsConst(value)
    Object.defineProperty(tmp, property, {value: value,enumerable: true,writable: false,configurable: false})
  Object.freeze(tmp)
module.exports = cloneAsConst
