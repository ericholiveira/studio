
var Debug = require('debug');

function Logger(config) {
    config = config||{};
    this.nameSpace = config.nameSpace||'Studio';
    this.debugger = Debug(this.nameSpace);
}

Logger.prototype.log = function Logger_log(data) {
    this.debugger(data.replace('%{nameSpace}', this.nameSpace));
};

Logger.prototype.error = function Logger_log(data) {
    this.debugger('ERROR: '+data.replace('%{nameSpace}', this.nameSpace));
};

module.exports = {
    instance: new Logger(),
    Logger: Logger
};
