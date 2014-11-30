function toggleViewEdit(id) {
    $('#todo_' + id + ' .view').toggle();
    $('#todo_' + id + ' .edit').toggle();
  }
  //Actors
  //Insertion
var toDoInsertView = new Studio.Actor({
  id: 'toDoInsertView',
  process: function(todo) {
    //YEAH , you should use some template engine
    var html = '<li id="todo_' + todo.id +
      '" class="todo_active"><div class="view"><input class="toggle" type="checkbox"><label>' +
      todo.value +
      '</label><button class="destroy"></button></div><div style="padding-left: 44px;"><input class="edit" value="' +
      todo.value + '"></div></li>';
    $('#todo-list').append(html);
    $('#new-todo').val('');
    $('#todo_' + todo.id + ' label').dblclick(function() {
      toggleViewEdit(todo.id);
    });
    return todo;
  }
});
var todoHookersView = new Studio.Actor({
  id: 'todoHookersView',
  process: function(id) {
    $('#todo_' + id + ' .toggle').click(function() {
      todoUpdateClickDriver.send(id);
    });
    $('#todo_' + id + ' button').click(function() {
      todoRemoveClickDriver.send(id);
    });
    $('#todo_' + id + ' .edit').keypress(function(event) {
      if ((event.keyCode || event.which) === 13) {
        todoUpdateContentDriver.send(id);
        toggleViewEdit(id);
      }
    });
  }
});
//Delete
var toDoDeleteView = new Studio.Actor({
  id: 'toDoDeleteView',
  process: function(id) {
    $('#todo_' + id).remove();
  }
});

//Update
var toDoUpdateView = new Studio.Actor({
  id: 'toDoUpdateView',
  process: function(todo) {
    $('#todo_' + todo.id).removeClass('todo_active');
    $('#todo_' + todo.id).removeClass('todo_completed');
    $('#todo_' + todo.id).addClass('todo_' + todo.status);
    $('#todo_' + todo.id + ' label').html(todo.value);
  }
});

//Footer
var footerView = new Studio.Actor({
  id: 'footerView',
  process: function(count) {
    if (count === 0) {
      $('#footer').hide();
    } else {
      $('#footer').show();
    }
  }
});
//ToDo show selection
var showTodoView = new Studio.Actor({
  id: 'showTodoView',
  process: function(typesToShow) {
    var i;
    $('.todo_active').hide();
    $('.todo_completed').hide();
    for (i = 0; i < typesToShow.length; i++) {
      $('.todo_' + typesToShow[i]).show();
    }
    $('#filters a').removeClass('selected');
    typesToShow.length === 2 ? $('#filters_all').addClass('selected') : $(
      '#filters_' + typesToShow[0]).addClass('selected');
  }
});
//ToDo show selection
var updateTodoCountView = new Studio.Actor({
  id: 'updateTodoCountView',
  process: function() {
    $('#todo-count strong').html($('.todo_active').length);
  }
});