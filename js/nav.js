

function MenuItemView(listview, data) {
	View.call(this);

	var div = listview.getDiv(); 

	this.width = listview.item_width;
	this.height = 60;
	
	var menuDiv = document.createElement('div');
	menuDiv.className = 'nav-list';
	menuDiv.style.width = this.width + "px";
	menuDiv.style.height = this.height + "px"
	//menuDiv.style.webkitTransitionDuration = "0.2s" 
	menuDiv.innerHTML = data;
		
	
	this.div = menuDiv;
	
	this.setDuration(0.2)
	
	div.appendChild(menuDiv);
}

MenuItemView.prototype = new ItemView();

MenuItemView.prototype.onKeyEvent = function (key) {
	
}
