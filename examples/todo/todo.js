var EnterPressedDriver = Studio.Driver.extends({
  constructor: function (options) {
    var that = this;
    EnterPressedDriver.__super__.constructor.call(this,options);
    $(options.selector).keypress(function (event) {
      if ((event.keyCode || event.which) === 13) {
        var element = this;
        that.send($(element).val()).then(function(html){
          $('#todo-list').append(html);
          $(element).val('');
        });
      }
    });
  }
});

var todoEnterPressedDriver = new EnterPressedDriver({
  selector:'#new-todo',
  parser: function (content) {
    return {
      sender: 'userInput',
      receiver: 'toDoHtml',
      body: content
    };
  }
});


var todoActor = new Studio.Actor({
  id: 'toDoHtml',
  process: function (message) {
    return '<li><div class="view"><input class="toggle" type="checkbox"><label>'+message+'</label><button class="destroy"></button></div><input class="edit" value="'+message+'"></li>';
  }
});
