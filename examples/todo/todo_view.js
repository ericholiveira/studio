//Actors
//Insertion
var toDoInsertView = new Studio.Actor({
  id: 'toDoInsertView',
  process: function(message) {
    var html = '<li id="todo_' + todo.id +
      '"><div class="view"><input class="toggle" type="checkbox"><label>' +
      todo.value +
      '</label><button onclick="todoRemoveClickDriver.send(' +
      todo.id +
      ');" class="destroy"></button></div><input class="edit" value="' +
      todo.value + '"></li>';
    $('#todo-list').append(html);
    $('#new-todo').val('');
  }
});
//Delete
var toDoDeleteView = new Studio.Actor({
  id: 'toDoDeleteView',
  process: function(id) {
    $('#todo_' + id).remove();
  }
});