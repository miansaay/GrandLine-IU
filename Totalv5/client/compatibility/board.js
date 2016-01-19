// BOARD
var Board = function() {
	BaseClass.call(this);
	this.initialize(0,0,900,630);
	this.scroll = 11;

	this.list = new Array(31);
	for (i = 0; i < 31; i++) {
		this.list[i] = new Array(15);
		for (j = 0; j < 15; j++) {
			this.list[i][j] = new Card(j*60,i*90);
			//this.list[i][j].setText(i.toString() + "," + j.toString());
		};
	};

	this.list[14][3].setSprite("ComienzoEscalera");
	this.list[12][11].setSprite("DestinoAtras");
	this.list[14][11].setSprite("DestinoAtras");
	this.list[16][11].setSprite("DestinoAtras");

	this.selectCell = function(x,y){
		if(!this.inRegion(x,y)){
			return null;
		}

		var columna = Math.floor(x/60);
	   	var fila = Math.floor(y/90);

	   	return [(fila+this.scroll),columna];
	};


	this.draw = function(){
		drawRect("black",this.x,this.y,this.w,this.h);
		for (i = this.scroll; i < this.scroll + 7; i++) {
			for (j = 0; j < 15; j++) {
				this.list[i][j].draw(this.scroll);
			};
		};
	};
};