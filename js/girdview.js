function View() {

	this.div = null;

}

View.prototype.getDiv = function() {
	return this.div;
}

View.prototype.onkeyEvent = function(keycode) {

};

View.prototype.setSelected = function () {

};

View.prototype.addClass = function (clsName) {
	if (typeof this.div === "object") {
		this.div.className += " " + clsName;
	}
}

View.prototype.moveTo = function (l,r,t,b) {
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

View.prototype.getStyle = function (obj,attr) {
	return getComputedStyle(obj,false)[attr];
}
//GridView  div:容器，index为索引
//optionview :对应的gridview里面的div块
function GridView(div,controller) {
	View.call(this);
	this.focus = new FocusView();
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
	//var wraper = document.getElementById("menu_wraper");
	var w = parseInt(this.getStyle(this.div,"width"));
	var currIndex = this.currIndex;
	var index = this.index;
	var items = this.items;
	var len = items.length;

	var tag = items[currIndex];
	var tag1 = items[index];
//	console.log("index==" + index + "-----currIndex==" + currIndex);
	if (index > currIndex) {   //向左移动
		tag.moveTo(-1 * w,null,null,null);
		tag1.moveTo(0,null,null,null)
	}else if (index < currIndex) {//向右移动
		tag.moveTo(w,null,null,null)
		tag1.moveTo(0,null,null,null)
	}

};

GridView.prototype.moveToLeft = function() {
	var items = this.items;
	var len = items.length;
	this.index --;
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
	this.index ++;
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
	var l = parseInt(this.getStyle(this.div,"width"));
	for (i = 0; i < menuCount; i++) {
		items[i] = ctrl.getView(this,items[i],i);
		items[i].moveTo(l,null,null,null);
		items[i].addClass('menu-list' + i);
	}
	items[0].moveTo(0,null,null,null);
}

GridView.prototype.setFocus = function(focus) {

};

GridView.prototype.focusAniation = function() {

};

GridView.prototype.onkeyEvent = function(key) {
	switch (key){
		case 37:
			this.moveToLeft();
			break;
		case 39:
			this.moveToRight();
			break;
		case 40:
			//return optionview.onkeyEvent;
			break;
		default:
			break;
	}
};

//每个菜单
function MenuView (gridview,data) {
	View.call(this);
	var div = gridview.getDiv();
	var menuDiv = document.createElement("div");
	menuDiv.className = "menu-list";
	menuDiv.innerText = data.name;
	menuDiv.style.background = data.bg;
	menuDiv.style.webkitTransitionDuration = ".3s"
	this.gridview = gridview;
	this.smalldiv = document.createElement("div");

	this.div = menuDiv;
	div.appendChild(menuDiv);
}

MenuView.prototype = new View();

MenuView.prototype.setVisble = function (index,position) {

}

MenuView.prototype.onkeyEvent = function (key,postion) {

}


//单个选项 or 色块
function OptionView(gridview,data,postion) {
	View.call(this);
	this.gridview = gridview;
	var div = gridview.getDiv();
	var samlldiv = document.createElement("div");
	this.div = samlldiv;
	div.appendChild(this.div);

}

OptionView.prototype = new View();

OptionView.prototype.setPostion = function () {

}

//确认
OptionView.prototype.onEnterDown = function(key) {

}

OptionView.setPostion = function() {

}

//焦点框类
function FocusView() {
	View.call(this);
}

FocusView.prototype = new View();



//gridview控制器
function Controller(viewConstructor,data) {
    this.data = data;
	//console.log(this.data);
	this.viewConstructor = viewConstructor;
}
Controller.prototype = {

	getView : function (gridview,menuview,postion) {
		var data = this.data[postion];
		var menu = new this.viewConstructor(gridview,data);
		menuview = menu;

		return menuview;
	},
	getConut : function () {
		return this.data.length;
	}
}

//listview控制器
function ListController (data) {
	this.data = data;
}

function page_init() {
	var ctrl = new Controller(MenuView,list);
	var gridview = new GridView(document.getElementById("menu_wraper"),	ctrl);
	console.log(gridview);
	document.onkeydown = function (e) {
		var key = e.keyCode;
		gridview.onkeyEvent(key);
	}
}


page_init();
