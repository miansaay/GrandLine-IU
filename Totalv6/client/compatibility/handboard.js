// HAND CARDS
var HandBoard = function(cardsHand,roll) {
	BaseClass.call(this);
	this.initialize(0,630,900,180);
	this.roll = roll;
	this.carta = undefined;

	this.list = new Array(cardsHand.length+2);

	for (i = 0; i < cardsHand.length; i++) {
		this.list[i] = new Card((i*90)+40,this.y + 50);
		this.list[i].setSprite(cardsHand[i]);
	};
	this.list[i] = new Card((i*90)+40,this.y + 50);
	this.list[i].setSprite("CaminoAtras");
	this.list[i].setText("PASAR");
	i = i + 1;
	
	this.list[i] = new Card((i*90)+40,this.y + 50);
	this.list[i].setText("GIRAR");

	//MARCA COMO SELECCIONADA UNA CARTA Y DEVUELVE SU NUMERO
	this.seleccionar = function(card){
		for (i = 0; i < this.list.length; i++){
			if(card == this.list[i]){
				this.list[i].seleccionada = true;
				console.log("Carta " + i + " seleccionada");
				return i;
			}
		};
	};

	//VUELVE AL ESTADO this.selected = false DE UNA CARTA CONCRETA (recibe el indice de la carta)
	//Solo es llamado si hay una carta seleccionada previamente 
	//(Salta la carta no estaba seleccionada con PASAR Y GIRAR)
	this.soltar = function(numCarta){
		if(this.list[numCarta].seleccionada == true){
			this.list[numCarta].seleccionada = false;
			console.log("Carta " + numCarta + " soltada");
		} else {
			console.log("la carta no estaba seleccionada");
		}
	};

	//length - 2 !!!
	this.updateHand = function(card, raton){
		if(card && this.carta === undefined){
			for (i = 0; i < this.list.length - 2; i++) {
				if(this.list[i] == card){
					if(raton){
						//Cambia el tamaño de la carta si paso el raton por encima
						//pongo a done el indice de la carta cambiada
						this.list[i].setSize(72,108);
						this.carta = i;	//0 es false
					};
				};
			};
		} else if(!card && this.carta > -1 && this.carta < this.list.length){
			this.list[this.carta].setSize(60,90);
			this.carta = undefined;
		}
	};

	//length - 2 !!!
	this.mover = function(card,x,y){
		for(i = 0; i < this.list.length - 2; i++){
			if(this.list[i] == card){
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
		for (i = 0; i < this.list.length; i++) {
			this.list[i].draw();
		};
	};
};