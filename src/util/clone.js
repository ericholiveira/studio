var cloneArray = function(arr){
  "use strict";
  var i, len, results;
    results = [];
    for (i = 0, len = arr.length; i < len; i++) {
        results.push(clone(arr[i]));
    }
    return results;
};
var cloneProperties = function(newInstance,obj){
  "use strict";
  var key;
  for (key in obj) {
      newInstance[key] = clone(obj[key]);
  }
  return newInstance;
};
var clone = function(obj) {
  "use strict";
  var flags, key, newInstance;
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (typeof obj.clone === 'function') {
        return obj.clone();
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
        flags = '';
        if (obj.global) {
            flags += 'g';
        }
        if (obj.ignoreCase) {
            flags += 'i';
        }
        if (obj.multiline) {
            flags += 'm';
        }
        if (obj.sticky) {
            flags += 'y';
        }
        return new RegExp(obj.source, flags);
    }
    if (obj instanceof Buffer) {
        newInstance = new Buffer(obj.length);
        obj.copy(newInstance);
        return newInstance;
    }
    if (obj instanceof Array) {
        return cloneArray(obj);
    }
    newInstance = new obj.constructor();
    return cloneProperties(newInstance,obj);
};

module.exports = clone;
