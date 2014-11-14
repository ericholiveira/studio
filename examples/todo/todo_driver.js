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

var todoUpdateContentDriver = new Studio.Driver({
  selector: '#new-todo',
  parser: function(id) {
    return {
      sender: 'userInput',
      receiver: 'toDoUpdateTextController',
      body: {
        id: id,
        value: $('#todo_' + id + ' .edit').val()
      }
    };
  }
});
var todoRemoveClickDriver = new Studio.Driver({
  parser: function(id) {
    return {
      sender: 'userInput',
      receiver: 'toDoDeleteController',
      body: id
    };
  }
});

var todoUpdateClickDriver = new Studio.Driver({
  parser: function(id) {
    return {
      sender: 'userInput',
      receiver: 'toDoUpdateStateController',
      body: id
    };
  }
});
var showTodoClickDriver = new Studio.Driver({
  parser: function(type) {
    return {
      sender: 'userInput',
      receiver: 'showTodoController',
      body: type
    };
  }
});