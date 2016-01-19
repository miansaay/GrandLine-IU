var PointsBoard = function(names) {
	BaseClass.call(this);
	this.initialize(900,0,200,810);
	this.list = new Array(names.length);

	var aux = 180;
	if(this.h / names.length < 180){
		aux = this.h / names.length;
	}

	for (i = 0; i < names.length; i++) {
		this.list[i] = new PlayerZone(this.x,this.y+(aux*i),this.w,aux);
		this.list[i].setName(names[i]);
	};


	this.updateTurno = function(turno){
		for (i = 0; i < this.list.length; i++) {
			if(this.list[i].name == turno){
				this.list[i].fontColor = "red";
			}else{
				this.list[i].fontColor = "yellow";
			}
		};
	};

	this.updateTarget = function(name,objeto){
		for (i = 0; i < this.list.length; i++) {
			if(this.list[i].name == name){
				this.list[i].changeObject(objeto);
			}
		};
	};

	this.selectTarget = function(x,y){
		if(!this.inRegion(x,y)){
			return null;
		}

		for (i = 0; i < this.list.length; i++) {
			if(this.list[i].inRegion(x,y)){
				return this.list[i].name;
			}
		};

		return null;
	};

	this.draw = function(){
		drawRect("black",this.x,this.y,this.w,this.h);
		for (i = 0; i < this.list.length; i++) {
			this.list[i].draw();
		};
	};
};