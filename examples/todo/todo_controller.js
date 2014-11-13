//Actors
//Insertion
var toDoInsertController = new Studio.Actor({
  id: 'toDoInsertController',
  process: function(item) {
    var that = this;
    this.send('toDoInsertDao', item).then(function(insertedItem) {
      that.send('toDoInsertView', insertedItem);
    });
  }
});
//Deletion
var toDoDeleteController = new Studio.Actor({
  id: 'toDoDeleteController',
  process: function(id) {
    this.send('toDoDeleteDao', id).then(function() {
      that.send('toDoDeleteView', id);
    });
  }
});

//Update
var toDoUpdateController = new Studio.Actor({
  id: 'toDoUpdateController',
  process: function(item) {
    this.send('toDoUpdateDao', item);
  }
});