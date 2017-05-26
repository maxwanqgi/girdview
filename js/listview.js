

function ListView(div, controller, focusViewConstructor){
	View.call(this);

	this.index = 0;
	this.items = [];
	this.div = div;
	this.selected = 0;
	this.displaycount = 5;
	this.displaybase = 0;
	this.startY = 0;
	this.startX = 0;
	this.item_height = 50;
	this.item_width = parseInt(this.getStyle("width")) / this.displaycount;
	

	//this.focusView = focusViewConstructor ? new focusViewConstructor(this) : new FocusView(this);
	this.ctrl = controller;

	this.needRepaintFocus = false;
	this.needRepaintItems = true;
	this.repaintItemsDirect = null;
	this.needDescendKeyEvent = true;
	this.render();
}

ListView.prototype = new View();

ListView.prototype.setVisible = function(visible) {

}

ListView.prototype.setDescendKeyEvent = function(isDown) {
	this.needDescendKeyEvent = isDown ? true : false;
}

ListView.prototype.setFocus = function(focus) {
	var item = this.items[this.selected];
	if (item) {
		item.setFocus(focus);
	}
}

ListView.prototype.painterList = function(isUp) {
	var i;
	var sum;
	var startY = this.startY;
	var startX = this.startX;
	var items = this.items;
	var ctrl = this.ctrl;
	var len = ctrl.getCount();
	var data = ctrl.data;
	var timer = null;
	var duration = this.duration * 1000;
	if (len <= this.displaycount) {
		sum = len;
	} else {
		sum = this.displaycount;
	}

	if (isUp === true) { //按键为方向键下，items向上移动      
		sum += 2;
		var base = this.displaybase - 1;
		var seeker = sum - 1;
		items.push(items.shift());
		for (i = 0; i < sum; i++) {
			var itemPostion = i;
			var dataPostion = i + base;
			var itemView = items[itemPostion];
			itemView = ctrl.getListView(this, itemView, dataPostion);
			if (itemView) {
				itemView.setVisible(i !== seeker);
				itemView.moveTo(startX + (i - 1) * this.item_width, null, null, null);
			}
			items[itemPostion] = itemView;
		}
		clearTimeout(timer);
		timer = setTimeout(function () {
			items[seeker].setVisible(true);
		},duration);
		this.repaintItemsDirect = null;

	} else if (isUp === false) { //按键为方向键上，items向下移动

		sum += 2;
		var base = this.displaybase - 1;
		var seeker = 0;
		items.unshift(items.pop());

		for (i = 0; i < sum; i++) {
			var itemPostion = i;
			var dataPostion = i + base;
			var itemView = items[itemPostion];
			itemView = ctrl.getListView(this, itemView, dataPostion);

			if (itemView) {
				itemView.setVisible(i !== seeker);
				itemView.moveTo(startX + (i - 1) * this.item_width, null, null, null);
			}
			items[itemPostion] = itemView;

		}
		clearTimeout(timer);
		timer = setTimeout(function () {
			items[seeker].setVisible(true);
		},duration);
		this.repaintItemsDirect = null;

	} else {
		var base = this.displaybase;
		var offset = 1;
		for (i = 0; i < sum; i++) {
			var itemPostion = i + offset;
			var dataPostion = i + base;
			items[itemPostion] = ctrl.getListView(this, items[itemPostion], dataPostion);
			
			items[itemPostion].moveTo(startX + i * this.item_width, null, null, null);
		}
		items[1].addClass("active-list");
	}
}


ListView.prototype.focusMove = function() {
	var items = this.items;

	var len = this.ctrl.getCount();

	var i;
	var sel = this.selected + 1;
	
	for(i = 1; i < items.length;i++) {
		items[i].removeClass("active-list")
	}
	items[sel].addClass("active-list")
	//console.log(items[sel])
}

ListView.prototype.setSelected = function(postion) {

}


ListView.prototype.render = function() {
	if (this.needRepaintFocus) {
		this.focusMove();
	}
	if (this.needRepaintItems) {
		this.painterList(this.repaintItemsDirect);

	}
}

ListView.prototype.onKeyEvent = function(keycode) {
	var sel = this.selected;
	var ctrl = this.ctrl;
	var items = this.items;
	var old_sel = sel;
	var channelCount = ctrl.getCount();

	if (keycode == 39) { 		
		if (channelCount > 0) {
			sel++;
	
			if (sel > channelCount - 1) {
				sel = 0;
			}
			this.index = sel;
		
			if (sel < channelCount) {
				this.selected = sel;
				if (this.displaybase + parseInt(this.displaycount / 2) < sel && this.displaybase + this.displaycount < channelCount) {
					this.displaybase ++;
					this.needRepaintFocus = false;
					this.needRepaintItems = true;
					this.repaintItemsDirect = true;
				} else {
					//focus move
					this.needRepaintFocus = true;
					this.needRepaintItems = false;
					this.repaintItemsDirect = null;
				}
				this.render();
			}

			var itemPositon = sel - this.displaybase + (this.needRepaintItems && sel > this.displaybase + parseInt(this.displaycount / 2) ? 2 : 1);
			this.needRepaintItems = true;
			this.onItemSelected(this, items[itemPositon], sel, items[itemPositon - 1], old_sel);
		}
		

	} else if (keycode == 37) { 
		
		
		if (channelCount > 0) {
			sel--;
			if (sel < 0) sel = channelCount - 1;
			this.index = sel;
			
			if (sel > -1) {
				this.selected = sel;
				if (this.displaybase + parseInt(this.displaycount / 2) > sel && this.displaybase > 0) {
					this.displaybase--;
					this.needRepaintFocus = false;
					this.needRepaintItems = true;
					this.repaintItemsDirect = false;
				} else {
					this.needRepaintFocus = true;
					this.needRepaintItems = false;
					this.repaintItemsDirect = null;
				}

				this.render();
			}

			var itemPositon = sel - this.displaybase + (this.needRepaintItems && sel > this.displaybase + parseInt(this.displaycount / 2) ? 2 : 1);
			this.needRepaintItems = true;
			this.onItemSelected(this, items[itemPositon], sel, items[itemPositon + 1], old_sel);
			
			
		}


	} else {

		var item = ctrl.getListView(this, items[sel - this.displaybase + 1], sel);

		if (this.needDescendKeyEvent) {

			item.onKeyEvent(keycode, sel);
		}
		if (keycode == 13) { //enter

			this.onItemClicked(this, item, sel);
		}
		
	}
	
	return true;
}


ListView.prototype.setFocusItem = function (curr) {
	var items = this.items;
	
	for(var i = 1;i < items.length;i ++) {
		items[i].removeClass("active-list");
	}
	items[curr].addClass("active-list")
	
}

ListView.prototype.onItemClicked = function(listview, itemview, postion) {

}

ListView.prototype.onItemSelected = function(listview, itemview_now, postion_now, itemview_old, postion_old) {

}

ListView.prototype.getCurrentIndex = function () {
	return this.selected;
}

//项目去继承itemview，根据实际情况去生成对应的itemview。
function ItemView() {
	View.call(this);
}

ItemView.prototype = new View();

ItemView.prototype.update = function(data) {

}

