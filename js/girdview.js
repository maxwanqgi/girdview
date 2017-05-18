
//GridView  包含5个menuview  父容器为div
function StackView(div, controller) {
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


	this.render();
}

StackView.prototype = new View();

StackView.prototype.render = function() {
	var i;
	var ctrl = this.ctrl;
	var data = ctrl.data;
	var menuCount = data.length;
	var items = this.items;
	var l = parseInt(this.getStyle("width"));
	for (i = 0; i < menuCount; i++) {
		items[i] = ctrl.getGridView(this, items[i], i);
		items[i].moveTo(l, null, null, null);
	}
	items[0].moveTo(0, null, null, null);
}

StackView.prototype.setMenuMove = function(moveMenu) {
	this.isMenuMove = moveMenu ? true : false;
}

StackView.prototype.setFocusMove = function(focuMenu) {
	this.isFocusMove = focuMenu ? true : false;
}

StackView.prototype.startMove = function() {
	var w = parseInt(this.getStyle("width"));
	var currIndex = this.currIndex;
	var sel = this.selected;
	var items = this.items;
	var len = items.length;
	var tag = items[currIndex];
	var tag1 = items[sel];
	tag.setDuration(0.2);

	if (sel == 0 && currIndex == len - 1) {
		tag.moveTo(-1 * w, null, null, null);
		tag1.setDuration(0);
		tag1.moveTo(w, null, null, null);
		clearTimeout();
		setTimeout(function() {
			tag1.setDuration(0.2);
			tag1.moveTo(0, null, null, null);
		})
	} else if (sel == len - 1 && currIndex == 0) {
		tag.moveTo(w, null, null, null);
		tag1.setDuration(0);
		tag1.moveTo(w * -1, null, null, null);
		clearTimeout();
		setTimeout(function() {
			tag1.setDuration(0.2);
			tag1.moveTo(0, null, null, null);
		})
	} else if (sel > currIndex) { //向左移动
		tag.moveTo(-1 * w, null, null, null);
		tag1.setDuration(0);
		tag1.moveTo(w, null, null, null);
		clearTimeout();
		setTimeout(function() {
			tag1.setDuration(0.2);
			tag1.moveTo(0, null, null, null);
		})
	} else if (sel < currIndex) { //向右移动
		tag.moveTo(w, null, null, null);
		tag1.setDuration(0);
		tag1.moveTo(w * -1, null, null, null);
		clearTimeout();
		setTimeout(function() {
			tag1.setDuration(0.2);
			tag1.moveTo(0, null, null, null);
		})
	}
};

StackView.prototype.moveToLeft = function() {
	var items = this.items;
	var len = items.length;
	this.selected--;
	if (this.selected < 0) {
		this.selected = len - 1;
		this.currIndex = 0;
	}
	this.startMove();
	this.currIndex = this.selected;
};

StackView.prototype.moveToRight = function() {
	var items = this.items;
	var len = items.length;
	this.selected++;
	if (this.selected > len - 1) {
		this.selected = 0;
		this.currIndex = len - 1;
	}
	this.startMove();
	this.currIndex = this.selected;
}

StackView.prototype.setVisiblePage = function (postion) {
	
}

StackView.prototype.onPageChange = function (curr,that) {
	
}

StackView.prototype.getPage = function (postion) {
	//获取当前的gridview；
	return this.items[postion];
}

StackView.prototype.onkeyEvent = function(key) {

	var isMenuMove = this.isMenuMove;
	var isFocusMove = this.isFocusMove;
	var sel = this.selected;
	var currMenu = this.items[sel];
	var list = currMenu.imageList;

	/*var accept = currMenu.onKeyEvent(key);
	if(accept)
	{
		return true;
	}*/
	
	if (key == 37) {
		//left
		if (isMenuMove == true && isFocusMove == false) {
			this.moveToLeft();
		}

		if (isMenuMove == false && isFocusMove == true) {
			currMenu.onKeyLeft(this);
		}
	} else if (key == 39) {
		//right
		if (isMenuMove == true && isFocusMove == false) {
			this.moveToRight();
		}
		if (isMenuMove == false && isFocusMove == true) {
			currMenu.onKeyRight(this);
		}
	} else if (key == 38) {

		if (isMenuMove == false && isFocusMove == true) {

			currMenu.onKeyTop(this);
		}
	} else if (key == 40) {
		//down
		if (isMenuMove == true && isFocusMove == false) {
			currMenu.setFocusShow();
			this.setMenuMove(false);
			this.setFocusMove(true);
		}
		if (isMenuMove == false && isFocusMove == true) {
			currMenu.onKeyDown(this);
		} 
	} else {
		if (key == 13) {
			if (this.isFocusMove == true && this.isMenuMove == false) {
				currMenu.onKeyEnter();
			}
		}

	}
};

//每个菜单   父容器为gridview
function GridView(stackview, data) {
	View.call(this);

	
	
	this.spacing = data.spacing;
	this.data = data;
	
	var div = stackview.getDiv();
	var menuDiv = document.createElement("div");

	menuDiv.className = "menu-list";

	this.div = menuDiv;
	this.imageItems = [];

	this.imageList = [];

	this.width = data.width;
	this.height = data.height;

	//行单元格数 * 列单元格数
	this.rowCount = data.rowCount;
	this.colCount = data.colCount;

	
	this.iteminfo = this.data.items;

	div.appendChild(menuDiv);

	this.render();
	this.focusView = new FocusView(this);
	this.focusPos = 0;
}

GridView.prototype = new View();

GridView.prototype.render = function() {
	var i;
	var itemInfo = this.iteminfo;
	var imageItems = this.imageItems;
	var ctrl = this.ctrl;

	this.setSize(this.data.width, this.data.height);

	for (i = 0; i < itemInfo.length; i++) {
		imageItems[i] = new ImageView(this, itemInfo[i]);
	}
};


GridView.prototype.onKeyRight = function(stackview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.imageList;
	var old = list[this.focusPos];
	this.focusPos++;
	var now = list[this.focusPos];

	if (old === now) {
		for (var i = old.coverFromX + 1; i < old.coverFromX + old.rowCover; i++) {
			this.focusPos++;
			//判断是否到了最右边，到了最右边继续按方向键右，GridView移动。
			if (this.focusPos % this.rowCount == 0 || list[this.focusPos] == undefined) {
				this.setFocusHide();
				stackview.setMenuMove(true);
				stackview.setFocusMove(false);
				this.focusPos = 0;
				stackview.moveToRight();
				
				return false;
			}
			this.setfocusPos(this.focusPos);
		}

	} else {

		if (this.focusPos % this.rowCount == 0 || list[this.focusPos] == undefined) {
			this.setFocusHide();
			stackview.setMenuMove(true);
			stackview.setFocusMove(false);
			this.focusPos = 0;
			stackview.moveToRight();
		}
		this.setfocusPos(this.focusPos);
	}
}


GridView.prototype.onKeyLeft = function(stackview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.imageList;
	var old = list[this.focusPos];
	this.focusPos--;
	var now = list[this.focusPos];
	if (old === now) {
		for (var i = old.coverFromX + old.rowCover - 1; i > old.coverFromX; i--) {
			this.focusPos--;
			if ((this.focusPos + 1) % this.rowCount == 0 || list[this.focusPos] == undefined) {
				this.setFocusHide();
				stackview.setMenuMove(true);
				stackview.setFocusMove(false);
				this.focusPos = 0;
				stackview.moveToLeft();
			}
			this.setfocusPos(this.focusPos);
		}

	} else {
		if ((this.focusPos + 1) % this.rowCount == 0 || list[this.focusPos] == undefined) {
			this.setFocusHide();
			stackview.setMenuMove(true);
			stackview.setFocusMove(false);
			this.focusPos = 0;
			stackview.moveToLeft();
		}
		this.setfocusPos(this.focusPos);
	}
}

//焦点框响应down键
GridView.prototype.onKeyDown = function(stackview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.imageList;

	var old = list[this.focusPos];
	this.focusPos += rowCount;
	var now = list[this.focusPos];

	if (old === now) {
		for (var i = old.coverFromY; i < old.coverFromY + old.colCover; i++) {
			this.focusPos += rowCount;
			if (list[this.focusPos] == undefined) {
				this.focusPos -= rowCount;
			}
			this.setfocusPos(this.focusPos);
		}
	} else {
		if (list[this.focusPos] == undefined) {
			this.focusPos -= rowCount;

		}
		this.setfocusPos(this.focusPos);
	}
}

//焦点框响应top键
GridView.prototype.onKeyTop = function(stackview) {
	var rowCount = this.rowCount;
	var colCount = this.colCount;
	var list = this.imageList;
	var old = list[this.focusPos];
	this.focusPos -= rowCount;
	var now = list[this.focusPos];

	if (old === now) {
		for (var i = old.coverFromY - 1; i > old.coverFromY - old.colCover; i--) {
			this.focusPos -= rowCount;
			if (this.focusPos < 0 || list[this.focusPos] == undefined) {
				this.setFocusHide();
				stackview.setMenuMove(true);
				stackview.setFocusMove(false);
				this.focusPos = 0;
			}
			this.setfocusPos(this.focusPos);
		}

	} else {
		if (this.focusPos < 0 || list[this.focusPos] == undefined) {
			this.setFocusHide();
			stackview.setMenuMove(true);
			stackview.setFocusMove(false);
			this.focusPos = 0;
		}
		this.setfocusPos(this.focusPos);
	}
}

GridView.prototype.onKeyEnter = function() {
	this.imageList[this.focusPos].onItemClicked()
}

GridView.prototype.setFocusShow = function() {
	this.focusView.show();
	this.setfocusPos(0);
};

GridView.prototype.setFocusHide = function() {
	this.focusView.hide();
	//this.initFocus();
};

GridView.prototype.setfocusPos = function(index) {

	var nextDiv = this.imageList[index];
	var borderW = parseInt(this.focusView.getStyle("borderWidth"));

	var w = nextDiv.width;
	var h = nextDiv.height;
	var l = nextDiv.left - borderW;
	var t = nextDiv.top - borderW;

	this.focusView.moveTo(l, null, t, null);
	this.focusView.setSize(w, h);
}

GridView.prototype.onItemClicked = function (gridview,iamgeview,position) {
	
}

GridView.prototype.setSelected = function () {
	
}

//单个选项 or 色块   父容器为menuview
function ImageView(gridview, data) {
	View.call(this);
	this.gridview = gridview;

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
	var spacing = gridview.spacing;
	var div = gridview.div;
	var smalldiv = document.createElement("div");

	var averageWidth = (gridview.width - (gridview.rowCount + 1) * spacing) / gridview.rowCount;
	var averageHeight = (gridview.height - (gridview.colCount + 1) * spacing) / gridview.colCount - 25; //-25是为了底部剩余空间来添加倒影

	this.width = averageWidth * this.rowCover + (this.rowCover - 1) * spacing;
	this.height = averageHeight * this.colCover + (this.colCover - 1) * spacing;
	this.left = this.coverFromX * averageWidth + (this.coverFromX + 1) * spacing;
	this.top = this.coverFromY * averageHeight + (this.coverFromY + 1) * spacing;

	smalldiv.className = this.cls;
	smalldiv.innerHTML = this.txt;
	smalldiv.style.background = this.bg;
	smalldiv.style.backgroundSize = "cover"
	smalldiv.style.lineHeight = this.height + "px";
	
	this.div = smalldiv;

	div.appendChild(smalldiv);

	this.render();

	this.pushItems();
	
};

ImageView.prototype = new View();

ImageView.prototype.pushItems = function() {
	var R = this.rowCover;
	var C = this.colCover;
	var startX = this.coverFromX;
	var startY = this.coverFromY;

	var rowCount = this.gridview.rowCount;
	var colCount = this.gridview.colCount;

	for (var c = startY; c < startY + C; c++) {
		for (var r = 0; r < R; r++) {
			var a = c * rowCount + startX + r;
			this.gridview.imageList[a] = this;
		}
	}
}
	//
ImageView.prototype.render = function() {
	this.moveTo(this.left, null, this.top, null);
	this.setSize(this.width, this.height);
}

//确认
ImageView.prototype.onItemClicked = function() {
	//window.location.href = this.url;
	alert(this.txt);
}

//焦点框类
function FocusView(gridview) {
	View.call(this);
	var div = gridview.getDiv();
	var focusDiv = document.createElement("div");

	focusDiv.className = "focus-div";
	this.div = focusDiv;
	div.appendChild(this.div);
	
	this.setDuration(0.2)
}

FocusView.prototype = new View();



function Controller(viewConstructor, data) {
	this.data = data;
	//console.log(this.data);
	this.viewConstructor = viewConstructor;
}

Controller.prototype = {

	getListView: function(listview, itemview, position) {
		var data = this.data[position];
		if (!itemview) {
			var item = new this.viewConstructor(listview, data);
			itemview = item;
		} else if (data) {
			itemview.update(data);
		}
		return itemview;
	},
	
	getGridView: function(stackview, gridview, postion) {
		var data = this.data[postion];
		var menu = new this.viewConstructor(stackview, data);
		gridview = menu;

		return gridview;
	},
	
	getImageView : function (gridview, imageview, postion) {
		var data= this.data[postion];
		var images = new this.viewConstructor(gridview, data);
		imageview = images;
		
		return imageview;
	},
	
	getCount: function() {
		return this.data.length;
	}
	
	
}



