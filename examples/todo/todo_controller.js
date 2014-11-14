//Actors
//Insertion
var toDoInsertController = new Studio.Actor({
  id: 'toDoInsertController',
  process: function(item) {
    var that = this;
    this.send('toDoInsertDao', item).then(function(insertedItem) {
      that.send('toDoInsertView', insertedItem).then(function() {
        that.send('updateTodoCountView');
        that.send('todoHookersView', insertedItem.id);
      });
      that.send('footerController');
    });
  }
});
//Deletion
var toDoDeleteController = new Studio.Actor({
  id: 'toDoDeleteController',
  process: function(id) {
    var that = this;
    this.send('toDoDeleteDao', id).then(function() {
      that.send('toDoDeleteView', id).then(function() {
        that.send('updateTodoCountView');
      });
      that.send('footerController');
    });
  }
});
toDoUpdateTextController = new Studio.Actor({
  id: 'toDoUpdateTextController',
  process: function(newItem) {
    var that = this;
    this.send('toDoReadDao', newItem.id).then(function(item) {
      item.value = newItem.value;
      that.send('toDoUpdateDao', item).then(function() {
        that.send('toDoUpdateView', item);
      });
    });
  }
});
//Update
var toDoUpdateStateController = new Studio.Actor({
  id: 'toDoUpdateStateController',
  process: function(id) {
    var that = this;
    this.send('toDoReadDao', id).then(function(item) {
      item.status = item.status === 'active' ? 'completed' : 'active';
      that.send('toDoUpdateDao', item).then(function() {
        that.send('toDoUpdateView', item).then(function() {
          that.send('updateTodoCountView');
        });
      });
    });
  }
});
//Footer
var footerController = new Studio.Actor({
  id: 'footerController',
  process: function() {
    var that = this;
    this.send('toDoCounterDao').then(function(count) {
      that.send('footerView', count);
    });
  }
});

//ToDo show selection
var showTodoController = new Studio.Actor({
  id: 'showTodoController',
  process: function(type) {
    this.send('showTodoView', type === 'all' ? ['completed', 'active'] : [
      type
    ]);
  }
});