function View() {

	this.div = null;

}

View.prototype.getDiv = function() {
	return this.div;
}

View.prototype.onkeyEvent = function(keycode) {

};

View.prototype.setSelected = function() {

};

View.prototype.addClass = function(clsName) {
	if (typeof this.div === "object") {
		this.div.className += " " + clsName;
	}
};

View.prototype.setVisible = function (visible) {
	this.div.style.display = visible ? "block" : "none";
}

View.prototype.show = function () {
	this.setVisible(true);
};

View.prototype.hide = function () {
	this.setVisible(false);
}

View.prototype.getStyle = function(attr) {
	if (typeof this.div === "object")
		return getComputedStyle(this.div, false)[attr];
}

View.prototype.setSize = function (w,h) {
	if(typeof this.div === "object") {
		this.div.style.width = w + "px";
		this.div.style.height = h + "px";
	}
}

View.prototype.moveTo = function(l, r, t, b) {
	if (typeof this.div === "object") {
		if (l || l === 0) {
			this.div.style.left = l + "px";
		}
		if (r || r === 0) {
			this.div.style.right = r + "px";
		}
		if (t || t === 0) {
			this.div.style.top = t + "px";
		}
		if (b || b === 0) {
			this.div.style.bottom = b + "px";
		}
	}
}

//GridView  包含5个menuview  父容器为div
function GridView(div, controller) {
	View.call(this);
	//this.focus = new FocusView();
	this.ctrl = controller;
	this.index = 0;
	this.currIndex = 0;
	this.selected = 0;
	this.items = [];
	this.div = div;

	this.isMenuMove = true;
	this.isFocusMove = false;
	
	this.FocusPos = 0;
	
	this.render();
}

GridView.prototype = new View();

GridView.prototype.startMove = function() {
	var w = parseInt(this.getStyle("width"));
	var currIndex = this.currIndex;
	var index = this.index;
	var items = this.items;
	var len = items.length;
	var tag = items[currIndex];
	var tag1 = items[index];

	if (index > currIndex) { //向左移动
		tag.moveTo(-1 * w, null, null, null);
		tag1.moveTo(0, null, null, null)
	} else if (index < currIndex) { //向右移动
		tag.moveTo(w, null, null, null)
		tag1.moveTo(0, null, null, null)
	}

};

GridView.prototype.moveToLeft = function() {
	var items = this.items;
	var len = items.length;
	this.index--;
	if (this.index < 0) {
		this.index = 0;
		this.currIndex = 0;
	}
	this.startMove();
	this.currIndex = this.index;
};

GridView.prototype.moveToRight = function() {
	var items = this.items;
	var len = items.length;
	this.index++;
	if (this.index > len - 1) {
		this.index = len - 1;
		this.currIndex = len - 1;
	}
	this.startMove();
	this.currIndex = this.index;
}

GridView.prototype.render = function() {
	var i;
	var ctrl = this.ctrl;
	var data = ctrl.data;
	var menuCount = data.length;
	var items = this.items;
	var l = parseInt(this.getStyle("width"));
	for (i = 0; i < menuCount; i++) {
		items[i] = ctrl.getView(this, items[i], i);
		items[i].moveTo(l, null, null, null);
		items[i].addClass('menu-list' + i);
	}
	items[0].moveTo(0, null, null, null);
}

GridView.prototype.onkeyEvent = function(key) {

	var isMenuMove = this.isMenuMove;
	var isFocusMove = this.isFocusMove;
	var index = this.index;
	if (key == 37) {
		if (isMenuMove == true && isFocusMove == false) {
			this.moveToLeft();
		} 
		if (isMenuMove == false && isFocusMove == true) {
			
		}
	}

	if (key == 39) {
		if (isMenuMove == true && isFocusMove == false) {
			this.moveToRight();
		}
		if (isMenuMove == false && isFocusMove == true) {
		
		}
	}

	if (key == 38) {
		//this.items[index].setFocusPos()
		this.items[index].setFocusHide();
		this.isMenuMove = true;
		this.isFocusMove = false;
		this.FocusPos = 0;
	}

	if (key == 40) {
		if (isMenuMove == false && isFocusMove == true) {
			
			
		}
		if (isMenuMove == true && isFocusMove == false) {
			this.items[index].setFocusShow();
			this.isMenuMove = false;
			this.isFocusMove = true;
		}
		
	}
};

//每个菜单   父容器为gridview
function MenuView(gridview, data) {
	View.call(this);

	this.spacing = data.spacing;

	var div = gridview.getDiv();
	var menuDiv = document.createElement("div");

	menuDiv.className = "menu-list";
	//menuDiv.style.background = data.bg;
	menuDiv.style.width = data.width + "px";
	menuDiv.style.height = data.height + "px";
	menuDiv.style.webkitTransition = "left .2s linear"

	this.div = menuDiv;
	this.divItems = [];
	
	this.grids = []

	this.width = data.width;
	this.height = data.height;

	//行单元格数 * 列单元格数
	this.rowCount = data.rowCount;
	this.colCount = data.colCount;

	this.data = data;
	this.iteminfo = this.data.items;

	div.appendChild(menuDiv);

	this.render();
	this.focusView = new FocusView(this);

}

MenuView.prototype = new View();

MenuView.prototype.render = function() {
	var i;
	var itemInfo = this.iteminfo;
	var divItems = this.divItems;
	var j;
	var rowCol = this.rowCount * this.colCount;
	var grids = this.grids
	
	for (i = 0; i < itemInfo.length; i ++) {
		divItems[i] = new ItemView(this, itemInfo[i]);
	}
	

};

MenuView.prototype.setFocusShow = function() {
	this.focusView.show();
	this.initFocus();
};

MenuView.prototype.setFocusHide = function() {
	this.focusView.hide();
	this.initFocus();
};

MenuView.prototype.initFocus = function () {
	var div = this.divItems[0];
	var borderW = parseInt(this.focusView.getStyle("borderWidth"));
	var start_left = div.left - borderW;
	var start_top = div.top - borderW;
	var start_width = div.width;
	var start_height = div.height;

	this.focusView.moveTo(start_left,null,start_top,null);
	this.focusView.setSize(start_width,start_height)
};

MenuView.prototype.setFocusPos = function(index) {

	var nextDiv = this.divItems[index];
	var borderW = parseInt(this.focusView.getStyle("borderWidth"));

	var w = nextDiv.width;
	var h = nextDiv.height;
	var l = nextDiv.left - borderW;
	var t = nextDiv.top - borderW;

	this.focusView.moveTo(l,null,t,null);
	this.focusView.setSize(w,h);
	
	
	var focu_width = this.focusView.getStyle("width");
	var focu_height = this.focusView.getStyle("height");
	var focu_left = this.focusView.getStyle("left");
	var focu_top = this.focusView.getStyle("top");
	console.log(focu_width + "++" + focu_height + "++" + focu_left + "++" + focu_top)
}

MenuView.prototype.onKeyEvent = function () {

}

//单个选项 or 色块   父容器为menuview
function ItemView(menuview, data) {
	View.call(this);
	//this.menuview = menuview;

	this.cls = data.cls;
	this.url = data.url;
	this.txt = data.name;

	//占据的单元格数
	this.rowCover = data.rowCover;
	this.colCover = data.colCover;
	//占据单元格的开始位置
	this.coverFromX = data.coverFromX;
	this.coverFromY = data.coverFromY;

	var spacing = menuview.spacing;
	var div = menuview.div;
	var smalldiv = document.createElement("div");

	var averageWidth = (menuview.width - (menuview.rowCount + 1) * spacing) / menuview.rowCount;
	var averageHeight = (menuview.height - (menuview.colCount + 1) * spacing) / menuview.colCount - 25; //-25是为了底部剩余空间来添加倒影

	this.width = averageWidth * this.rowCover + (this.rowCover - 1) * spacing;
	this.height = averageHeight * this.colCover + (this.colCover - 1) * spacing;
	this.left = this.coverFromX * averageWidth + (this.coverFromX + 1) * spacing;
	this.top = this.coverFromY * averageHeight + (this.coverFromY + 1) * spacing;

	smalldiv.className = this.cls;
	
	smalldiv.innerHTML = "this.rowCover = " + this.rowCover + " <br/>this.colCover = " + this.colCover + "<br/>" + "coverFromX = " +
		this.coverFromX + "<br/>" + "coverFromY = " + this.coverFromY 
		
	this.div = smalldiv;

	div.appendChild(smalldiv);

	this.setPostion();
};

ItemView.prototype = new View();

ItemView.prototype.setPostion = function() {
	this.moveTo(this.left,null,this.top,null)
	this.setSize(this.width,this.height)
}

//确认
ItemView.prototype.onItemClicked = function() {
	window.location.href = this.url;
}

//焦点框类
function FocusView(menuview) {
	View.call(this);
	var div = menuview.getDiv();
	var focusDiv = document.createElement("div");
	focusDiv.style.webkitTransitionDuration = "0.2s"
	focusDiv.style.webkitTransitionTimingFunction = "linear"
	focusDiv.className = "focus-div";
	this.div = focusDiv;
	div.appendChild(this.div);
}

FocusView.prototype = new View();


function Controller(viewConstructor, data) {
	this.data = data;
	//console.log(this.data);
	this.viewConstructor = viewConstructor;
}
Controller.prototype = {

	getView: function(gridview, menuview, postion) {
		var data = this.data[postion];
		var menu = new this.viewConstructor(gridview, data);
		menuview = menu;

		return menuview;
	},

	getConut: function() {
		return this.data.length;
	}
}

function page_init() {
	var ctrl = new Controller(MenuView, list);
	var gridview = new GridView(document.getElementById("menu_wraper"), ctrl);
	console.log(gridview);

	document.onkeydown = function(e) {
		var key = e.keyCode;
		gridview.onkeyEvent(key, gridview.index);

	}
}

page_init();
