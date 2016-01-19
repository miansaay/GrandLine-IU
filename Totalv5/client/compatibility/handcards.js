// HAND CARDS
var HandBoard = function(cardsHand,roll) {
	BaseClass.call(this);
	this.initialize(0,630,900,180);
	this.roll = roll;
	this.list = new Array(cardsHand.length+2);

	for (i = 0; i < cardsHand.length; i++) {
		this.list[i] = new Card((i*90)+40,this.y + 50);
		this.list[i].setSprite(cardsHand[i]);
	};
	this.list[i] = new Card((i*90)+40,this.y + 50);
	this.list[i].setText("PASAR");
	i = i + 1;
	this.list[i] = new Card((i*90)+40,this.y + 50);
	this.list[i].setText("GIRAR");

	this.updateHand = function(card){
		for (i = 0; i < this.list.length - 2; i++) {
			this.list[i].setColor("transparent");
			this.list[i].setSize(60,90);
			if(this.list[i] === card){
				this.list[i].setSize(72,108);
			}
		};

	};

	this.mover = function(card,x,y){
		for(i = 0; i < this.list.length - 2; i++){
			if(this.list[i] === card){
//				console.log("muevo a: (" + card.x + "," + card.y + ")");
				this.list[i].setCoord(x,y);
			}
		}
	}

	this.inRegion = function(x,y){
		for (i = 0; i < this.list.length; i++) {
			var aux = this.list[i];
			if(aux.inRegion(x,y)){
				return aux;
			}
		};
		return null;
	};

	this.draw = function(){
		drawText(this.roll,"red","20px Georgia",this.x + 400,this.y + 30);
		drawRect("black",this.x,this.y,this.w,this.h);
//		console.log("dibujo mano");
		for (i = 0; i < this.list.length; i++) {
			this.list[i].draw();
		};
	};
};