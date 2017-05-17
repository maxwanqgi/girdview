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
			var reg1 = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			this.div.className = this.div.className.replace(reg1,'');
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
		return this.div;
	}
}


View.prototype.setDuration = function (time) {
	if (typeof this.div == "object") {
		this.div.style.WebkitTransitionDuration = time + "s";

	}
}









