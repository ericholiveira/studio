//Drivers object
var todoEnterPressedDriver = new Studio.Driver({
  initialize: function() {
    var that = this;
    $(this.selector).keypress(function(event) {
      if ((event.keyCode || event.which) === 13) {
        var element = this;
        that.send(element);
      }
    });
  },
  selector: '#new-todo',
  parser: function(element) {
    return {
      sender: 'userInput',
      receiver: 'toDoInsertController',
      body: $(element).val()
    };
  }
});
var todoRemoveClickDriver = new Studio.Driver({
  parser: function(id) {
    return {
      sender: 'userInput',
      receiver: 'toDoDeletController',
      body: id
    };
  }
});