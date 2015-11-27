var cloneArray = function(arr){
    var i, len, results;
    results = [];
    for (i = 0, len = arr.length; i < len; i++) {
        results.push(arr[i]);
    }
    return results;
};
var clone = function(obj) {
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
    for (key in obj) {
        newInstance[key] = clone(obj[key]);
    }
    return newInstance;
};

module.exports = clone;