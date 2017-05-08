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

View.prototype.getStyle = function(attr) {
	if (typeof this.div === "object")
		return getComputedStyle(this.div, false)[attr];
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

GridView.prototype.focusAniation = function() {

};

GridView.prototype.onkeyEvent = function(key, index) {
	switch (key) {
		case 37:
			this.moveToLeft();
			break;
		case 39:
			this.moveToRight();
			break;
		case 40:
			//return Menuview.onkeyEvent;    //menuview ---> this.items[index];
			//this.items[index].onkeyEvent(key);
			//console.log(this.items[index])
			break;
		default:
			break;
	}
};

//每个菜单   父容器为gridview
function MenuView(gridview, data, controller) {
	View.call(this);

	this.spacing = data.spacing;

	var div = gridview.getDiv();
	var menuDiv = document.createElement("div");

	menuDiv.className = "menu-list";
	menuDiv.style.background = data.bg;
	menuDiv.style.width = data.width + "px";
	menuDiv.style.height = data.height + "px";
	menuDiv.style.webkitTransition = "left .3s linear"

	this.gridview = gridview;

	this.div = menuDiv;
	this.divItems = [];
	this.focusShow = false;

	this.width = data.width;
	this.height = data.height;

	this.itemwidth = data.itemwidth;
	this.itemheight = data.itemheight;

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
	for (i = 0; i < itemInfo.length; i++) {
		divItems[i] = new ItemView(this, itemInfo[i]);
		//divItems[i].moveTo()
	}
};

MenuView.prototype.setFocusVisible = function(focus) {

};

MenuView.prototype.setFocusPos = function() {

}

MenuView.prototype.onkeyEvent = function(key) {
	var gridview = this.gridview;

	switch (key) {
		case 37: //left  边界返回girdview.onkeyEvent

			break;
		case 39: //right 边界返回girdview.onkeyEvent

			break;
		case 38: //top   边界返回girdview.onkeyEvent

			break;
		case 40: //down  焦点框最底部不在相应
			break;
		case 13: //enter
			//	return this.divItems[index].onItemClicked();
			break;
		default:
			break;
	}
}

//单个选项 or 色块   父容器为menuview
function ItemView(menuview, data) {
	View.call(this);
	//this.menuview = menuview;

	this.cls = data.cls;
	this.url = data.url;
	this.txt = data.name;

	//占据的单元格数。
	this.rowOver = data.rowOver;
	this.colOver = data.colOver;

	var spacing = menuview.spacing;
	var div = menuview.div;
	var smalldiv = document.createElement("div");

	var averageWidth = (menuview.width - (menuview.rowCount + 1) * spacing) / menuview.rowCount;
	var averageHeight = Math.ceil((menuview.height - (menuview.colCount + 1) * spacing) / menuview.colCount - 25); //-25是为了底部剩余空间来添加倒影

	this.width = Math.ceil(averageWidth * this.rowOver + (this.rowOver - 1) * spacing);
	this.height = Math.ceil(averageHeight * this.colOver + (this.colOver - 1) * spacing);

	smalldiv.className = this.cls;
	smalldiv.innerHTML = this.txt;
	smalldiv.style.width = this.width + "px";
	smalldiv.style.height = this.height + "px";

	this.div = smalldiv;

	div.appendChild(smalldiv);

	this.setPostion();
}

ItemView.prototype = new View();

ItemView.prototype.setPostion = function() {

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
	focusDiv.className = "focus-div";
	this.div = focusDiv;
	div.appendChild(this.div);
}

FocusView.prototype = new View();

FocusView.prototype.setVisble = function(isShow) {
	this.div.style = isShow ? "block" : "none";
}

//gridview控制器
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
	console.log(gridview)

	document.onkeydown = function(e) {
		var key = e.keyCode;
		gridview.onkeyEvent(key, gridview.index);

	}
}

page_init();