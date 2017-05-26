/*var KeyEvent = {
	KeyEvent_UP :38,
	KeyEvent_DOWN :40
}
	*/
function View() {

	this.div = null;
	this.focus = false;

}


View.prototype.getDiv = function() {
	return this.div;
}

View.prototype.onkeyEvent = function(keycode) {
	
};

View.prototype.setSelected = function() {
	
};


View.prototype.changeFocus = function(focus) {
	this.focus = focus;
	
};

View.prototype.isFocus = function() {
	return this.focus;
};

View.prototype.onFocusChange = function(focus) {
	
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
	if (typeof this.div === "object"){
		if (this.div.currentStyle) {
			return this.div.currentStyle.attr;
		}else {
			return getComputedStyle(this.div, false)[attr];
		}
	}	
}

View.prototype.setSize = function(w, h) {
	if (typeof this.div === "object") {
		this.div.style.width = w + "px";
		this.div.style.height = h + "px";
	}
}

View.prototype.hasclass = function (className) {
	if (typeof this.div === "object") {
		var reg = new RegExp('(^|\\s+)' + className + '($|\\s+)');
		return reg.test(this.div.className);
	}
}

View.prototype.addClass = function (cls) {
	if (typeof this.div === "object") {
		if(!this.hasclass(cls)) {
			this.div.className += ' ' + cls;
		}
	}	
}

View.prototype.removeClass = function (cls) {
	if (typeof this.div === "object") {
		if(this.hasclass(cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			this.div.className = this.div.className.replace(reg,'');
		}
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


View.prototype.setDuration = function (duration) {
	if (typeof this.div == "object") {
		this.div.style.transitionDuration = duration + "s";
		this.div.style.WebkitTransitionDuration = duration + "s";
		this.div.style.msTransitionDuration = duration + "s";
		this.div.style.MozTransitionDuration = duration + "s";
	}
}




//



var keycode = {
	key_left : 37,
	key_right : 39,
	key_up : 38,
	key_down : 40,
	key_enter : 13,
	key_space : 32
}


console.log(keycode.key_down)