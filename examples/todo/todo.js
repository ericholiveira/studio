//Drivers Definition
var EnterPressedDriver = Studio.Driver.extends({
  constructor: function(options) {
    var that = this;
    EnterPressedDriver.__super__.constructor.call(this, options);
    $(options.selector).keypress(function(event) {
      if ((event.keyCode || event.which) === 13) {
        var element = this;
        that.process(element);
      }
    });
  },
  process: function(element) {
    this.send(element).then(function(html) {
      $('#todo-list').append(html);
      $(element).val('');
    });
  }
});


//Drivers object
var todoEnterPressedDriver = new EnterPressedDriver({
  selector: '#new-todo',
  parser: function(element) {
    return {
      sender: 'userInput',
      receiver: 'processToDoInsertion',
      body: $(element).val()
    };
  }
});

var todoRemoveClickDriver = new Studio.Driver({
  parser: function(id) {
    return {
      sender: 'userInput',
      receiver: 'processToDoDeletion',
      body: id
    };
  }
});
todoRemoveClickDriver.process = function(id) {
  this.send(id).then(function(id) {
    $('#todo_' + id).remove();
  });
};
//Actors
//Insertion
var processToDoInsertionActor = new Studio.Actor({
  id: 'processToDoInsertion',
  process: function(message) {
    var defer = Studio.Q.defer();
    this.send('insertToDo', message).then(function(todo) {
      defer.resolve('<li id="todo_' + todo.id +
        '"><div class="view"><input class="toggle" type="checkbox"><label>' +
        todo.value +
        '</label><button onclick="todoRemoveClickDriver.process(' +
        todo.id +
        ');" class="destroy"></button></div><input class="edit" value="' +
        todo.value + '"></li>');
    }).catch(defer.reject);
    return defer.promise;
  }
});

var insertToDoActor = new Studio.Actor({
  id: 'insertToDo',
  process: function(message) {
    var id = new Date().getTime(); // terrible id implementation, but is simple and is enough for the example
    var item = {
      id: id,
      value: message
    };
    window.localStorage.setItem(id, JSON.stringify(item));
    return item;
  }
});

//Deletion

var processToDoDeletionActor = new Studio.Actor({
  id: 'processToDoDeletion',
  process: function(id) {
    window.localStorage.removeItem(id);
    return id;
  }
});