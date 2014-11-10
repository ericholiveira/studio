var todoEnterPressedDriver = new Studio.Driver({
  parser: function (event) {

  }
});
window.$('#new-todo').keypress(function (event) {
  var keycode = (ev.keyCode ? ev.keyCode : ev.which);
  if (event.keyCode || event.which === 13) {
    todoEnterPressedDriver
  }
});

/*
<li>
			<div class="view">
				<input class="toggle" type="checkbox">
				<label>jkjhk</label>
				<button class="destroy"></button>
			</div>
			<input class="edit" value="jkjhk">
		</li>
*/
