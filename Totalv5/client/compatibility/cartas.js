var Card = function(x,y) {
	BaseClass.call(this);
	this.girada = false;
	this.color = "transparent";
	this.sprite = "Standard";
	this.seleccionada = false;
	this.moviendo = false;
	this.initialize(x,y,60,90);

	this.setCoord = function(x,y){
		this.x = x;
		this.y = y;
	};

	this.setSprite = function(sprite){
		this.sprite = sprite;
	};

	this.setColor = function(color){
		this.color = color;
	};

	this.setText = function(text){
		this.text = text;
	};

	this.girar = function(){
		this.girada = !this.girada;
	};

	this.setSize = function(w,h){
		this.w = w;
		this.h = h;
		if(w != 60){
			this.seleccionada = true;
		} else {
			this.seleccionada = false;
		}
	}

	this.draw = function(scroll, coordx, coordy){
		var x = this.x;
		var y = this.y;
		if(scroll){
			y = this.y - (scroll * this.h);
		}
		if(this.seleccionada){
			x = x-10;
			y = y-10;
		};
		SpriteSheet.draw(this.sprite,x,y, this.w, this.h, this.girada);
		drawRect(this.color,x,y,this.w,this.h);
		if(this.text){
			drawText(this.text,"black","20px Georgia",x,y + 40);
		}
	};
};