//Actors
//Insertion
var toDoInsertDao = new Studio.Actor({
  id: 'toDoInsertDao',
  process: function(text) {
    var id = new Date().getTime(); // terrible id implementation, but is simple and is enough for the example
    var item = {
      id: id,
      value: text,
      status: 'active'
    };
    window.localStorage.setItem(id, JSON.stringify(item));
    return item;
  }
});
//Deletion
var toDoDeleteDao = new Studio.Actor({
  id: 'toDoDeleteDao',
  process: function(id) {
    window.localStorage.removeItem(id);
    return id;
  }
});
//Update
var toDoUpdateDao = new Studio.Actor({
  id: 'toDoUpdateDao',
  process: function(newItem) {
    window.localStorage.setItem(newItem.id, JSON.stringify(newItem));
    return newItem;
  }
});
//Update
var toDoReadDao = new Studio.Actor({
  id: 'toDoReadDao',
  process: function(id) {
    return JSON.parse(window.localStorage.getItem(id));
  }
});

//Counter
var toDoCounterDao = new Studio.Actor({
  id: 'toDoCounterDao',
  process: function(id) {
    return window.localStorage.length;
  }
});