# Detect if object is array
module.exports.isArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'
# return the array intersection
module.exports.intersection = (a, b) ->
  [a, b] = [b, a] if a.length > b.length
  value for value in a when value in b
