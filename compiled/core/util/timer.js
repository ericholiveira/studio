(function() {
  var Timer;

  Timer = {
    enqueue: function(funktion) {
      if ((typeof proccess !== "undefined" && proccess !== null ? proccess.nextTick : void 0) != null) {
        return proccess.nextTick(funktion);
      } else {
        return setTimeout(funktion, 0);
      }
    }
  };

  module.exports = Timer;

}).call(this);

//# sourceMappingURL=..\..\maps\timer.js.map
