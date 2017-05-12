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

View.prototype.setVisible = function(visible) {
	this.div.style.display = visible ? "block" : "none";
}

View.prototype.show = function() {
	this.setVisible(true);
};

View.prototype.hide = function() {
	this.setVisible(false);
}

View.prototype.getStyle = function(attr) {
	if (typeof this.div === "object")
		return getComputedStyle(this.div, false)[attr];
}

View.prototype.setSize = function(w, h) {
	if (typeof this.div === "object") {
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
		return this.div;
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

	this.focusPos = 0;

	this.render();
}

GridView.prototype = new View();


GridView.prototype.setMenuMove = function (moveMenu) {
	this.isMenuMove = moveMenu ? true : false;
}

GridView.prototype.setFocusMove = function (focuMenu) {
	this.isFocusMove = focuMenu ? true : false;
}

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
	var currMenu = this.items[index];
	var list = currMenu.gridList;
	
	if (key == 37) {
		//left
		if (isMenuMove == true && isFocusMove == false) {

			this.moveToLeft();
		}
		
		if (isMenuMove == false && isFocusMove == true) {

			currMenu.focusToLeft(this);
		}
	}

	else if (key == 39) {
		//right
	
		if (isMenuMove == true && isFocusMove == false) {
			this.moveToRight();
		}
		if (isMenuMove == false && isFocusMove == true) {
			currMenu.focusToRight(this);
		}
	}

	else if (key == 38) {

		if (isMenuMove == false && isFocusMove == true) {

			currMenu.focusToTop(this)
		}

	}

	else if (key == 40) {
		//down
		if (isMenuMove == false && isFocusMove == true) {	
			currMenu.focusToDown(this);
		}
		else if (isMenuMove == true && isFocusMove == false) {
			this.items[index].setFocusShow();
			this.isMenuMove = false;
			this.isFocusMove = true;
		}
	}
	else {
		if (key == 13) {
			if (this.isFocusMove == true && this.isMenuMove == false) {
				currMenu.onEnter();
			}
			
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

	this.gridList = [];

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
	this.focusPos = 0;

}

MenuView.prototype = new View();

MenuView.prototype.render = function() {
	var i;
	var itemInfo = this.iteminfo;
	var divItems = this.divItems;

	var R;
	var C;
	var startX;
	var startY;

	for (i = 0; i < itemInfo.length; i++) {
		divItems[i] = new ItemView(this, itemInfo[i]);
	}
};
MenuView.prototype.focusToRight = function(gridview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.gridList;
	var old = list[this.focusPos];
	this.focusPos++;
	var now = list[this.focusPos];

	if (old === now) {
		for (var i = old.coverFromX + 1; i < old.coverFromX + old.rowCover; i++) {
			this.focusPos++;
			if (this.focusPos % this.rowCount == 0) {
				this.setFocusHide();
				//gridview.isMenuMove = true;
				gridview.setMenuMove(true);
				//gridview.isFocusMove = false;
				gridview.setFocusMove(false);	
				this.focusPos = 0;
				gridview.moveToRight();
			}
			this.setfocusPos(this.focusPos);
		}

	} else {

		if (this.focusPos % this.rowCount == 0 || list[this.focusPos] == undefined) {
			this.setFocusHide();
			gridview.setMenuMove(true);
			gridview.setFocusMove(false);	
			this.focusPos = 0;
			gridview.moveToRight();
		}
		this.setfocusPos(this.focusPos);
	}
}

MenuView.prototype.focusToLeft = function(gridview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.gridList;
	var old = list[this.focusPos];
	this.focusPos--;
	var now = list[this.focusPos];
	if (old === now) {
		for (var i = old.coverFromX + 1; i < old.coverFromX + old.rowCover; i++) {
			this.focusPos--;
			if ((this.focusPos + 1) % this.rowCount == 0) {
				this.setFocusHide();
				gridview.setMenuMove(true);
				gridview.setFocusMove(false);	
				this.focusPos = 0;
				gridview.moveToLeft();
			}
			this.setfocusPos(this.focusPos);
		}

	} else {
		if ((this.focusPos + 1) % this.rowCount == 0) {
			this.setFocusHide();
			gridview.setMenuMove(true);
			gridview.setFocusMove(false);	
			this.focusPos = 0;
			gridview.moveToLeft();
		}
		this.setfocusPos(this.focusPos);
	}
}

MenuView.prototype.focusToDown = function(gridview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.gridList;
	
	var old = list[this.focusPos];
	this.focusPos += rowCount;
	var now = list[this.focusPos];
	
	if (old === now) {
		for (var i = old.coverFromY; i < old.coverFromY + old.colCover; i++) {
			this.focusPos += rowCount;
			if (this.focusPos > list.length - 1) {
				this.focusPos -= this.rowCount;
			}

			this.setfocusPos(this.focusPos);
		}
	} else {
		if (this.focusPos > list.length - 1) {
			this.focusPos -= this.rowCount;
		}
		this.setfocusPos(this.focusPos);
	}

}

MenuView.prototype.focusToTop = function(gridview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.gridList;
	var old = list[this.focusPos];
	this.focusPos -= rowCount;
	var now = list[this.focusPos];

	if (old === now) {
		for (var i = old.coverFromY - 1; i > old.coverFromY - old.colCover; i--) {
			this.focusPos -= this.rowCount;
			if (this.focusPos < 0) {
				this.setFocusHide();
				gridview.isMenuMove = true;
				gridview.isFocusMove = false;
				this.focusPos = 0;
			}
			this.setfocusPos(this.focusPos);
		}

	} else {
		if (this.focusPos < 0) {
			this.setFocusHide();
			gridview.isMenuMove = true;
			gridview.isFocusMove = false;
			this.focusPos = 0;
		}
		this.setfocusPos(this.focusPos);
	}
}

MenuView.prototype.setFocusShow = function() {
	this.focusView.show();
	this.initFocus();
};

MenuView.prototype.setFocusHide = function() {
	this.focusView.hide();
	//this.initFocus();
};

MenuView.prototype.initFocus = function() {
	var div = this.gridList[0];
	var borderW = parseInt(this.focusView.getStyle("borderWidth"));
	var start_left = div.left - borderW;
	var start_top = div.top - borderW;
	var start_width = div.width;
	var start_height = div.height;

	this.focusView.moveTo(start_left, null, start_top, null);
	this.focusView.setSize(start_width, start_height)
};

MenuView.prototype.setfocusPos = function(index) {

	var nextDiv = this.gridList[index];
	var borderW = parseInt(this.focusView.getStyle("borderWidth"));

	var w = nextDiv.width;
	var h = nextDiv.height;
	var l = nextDiv.left - borderW;
	var t = nextDiv.top - borderW;

	this.focusView.moveTo(l, null, t, null);
	this.focusView.setSize(w, h);

}

MenuView.prototype.onEnter = function() {
	this.gridList[this.focusPos].onItemClicked()
}

//单个选项 or 色块   父容器为menuview
function ItemView(menuview, data) {
	View.call(this);
	this.menuview = menuview;

	this.cls = data.cls;
	this.url = data.url;
	this.txt = data.name;
	this.bg = data.bg;
	//占据的单元格数
	this.rowCover = data.rowCover;
	this.colCover = data.colCover;
	//占据单元格的开始位置
	this.coverFromX = data.coverFromX;
	this.coverFromY = data.coverFromY;

	this.divgrid = [];
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
	smalldiv.innerHTML = this.txt;
	smalldiv.style.background = this.bg;
	smalldiv.style.backgroundSize = "cover"
	smalldiv.style.position = "absolute";
	smalldiv.style.color = "white";
	smalldiv.style.textAlign = "center";
	smalldiv.style.lineHeight = this.height + "px";
	smalldiv.style.fontSize = "20px";
	this.div = smalldiv;

	div.appendChild(smalldiv);

	this.render();

	this.pushItems();
};

ItemView.prototype = new View();

ItemView.prototype.pushItems = function() {
	var R = this.rowCover;
	var C = this.colCover;
	var startX = this.coverFromX;
	var startY = this.coverFromY;

	var rowCount = this.menuview.rowCount;
	var colCount = this.menuview.colCount;

	for (var c = startY; c < startY + C; c++) {
		for (var r = 0; r < R; r++) {
			var a = c * rowCount + startX + r;
			this.menuview.gridList[a] = this;
		}
	}
}
	//
ItemView.prototype.render = function() {
	this.moveTo(this.left, null, this.top, null);
	this.setSize(this.width, this.height);
}

//确认
ItemView.prototype.onItemClicked = function() {
	//window.location.href = this.url;
	alert(this.txt);
}

//焦点框类
function FocusView(menuview) {
	View.call(this);
	var div = menuview.getDiv();
	var focusDiv = document.createElement("div");
	focusDiv.style.webkitTransitionDuration = "0.2s";
	focusDiv.style.webkitTransitionTimingFunction = "linear";
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