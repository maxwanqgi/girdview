function page_init() {
	var ctrl = new Controller(MenuView, list);
	var gridview = new GridView(document.getElementById("menu_wraper"), ctrl);
	console.log(gridview);
	
	var ctrl1 = new Controller(MenuItemView, items);
	var listview = new ListView(document.getElementById("nav_wraper"),ctrl1,null);
	console.log(listview)
	
	document.onkeydown = function(e) {
		var key = e.keyCode;
		gridview.onkeyEvent(key);
		if (gridview.isFocusMove == false && gridview.isMenuMove == true) {
			listview.onKeyEvent(key)
		}
		
	}
}

page_init();