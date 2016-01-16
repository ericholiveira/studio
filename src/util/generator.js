module.exports = {
    isGeneratorFunction : function (obj) {
        var constructor = obj.constructor || {};
        return 'GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName;
    }
};