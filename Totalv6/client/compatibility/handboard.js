// HAND CARDS
//Al crear este objeto cardsHand ha de ser un array de SPRITES con los nombres de las cartas
//No un mazo como tal (handsBoard ya lo es)
var HandBoard = function(cardsHand,roll) {
	BaseClass.call(this);
	this.initialize(0,630,900,180);
	this.roll = roll;
	this.seleccionada = false;
	this.numCarta = undefined;

	this.list = new Array(cardsHand.length);

	for (i = 0; i < cardsHand.length; i++) {
		this.list[i] = new Card((i*90)+40,this.y + 50);
		this.list[i].setSprite(cardsHand[i]);
	};

	//ELIMINO POR AHORA ESTAS 2 CARTAS
/*	this.list[i] = new Card((i*90)+40,this.y + 50);
	this.list[i].setSprite("CaminoAtras");
	this.list[i].setText("PASAR");
	i = i + 1;
	
	this.list[i] = new Card((i*90)+40,this.y + 50);
	this.list[i].setText("GIRAR");
*/

	//Devuelve una copia de este objeto
	this.copiar = function(){
		var sprites = new Array(this.list.length);
		for(i = 0; i < this.list.length; i++){
			sprites[i] = this.list[i].sprite;
		}
		mazoAux = new HandBoard(sprites, this.roll);
		return mazoAux;
	};

	//MARCA COMO SELECCIONADA UNA CARTA Y DEVUELVE SU NUMERO o null
	this.seleccionar = function(card){
		for (i = 0; i < this.list.length; i++){
			if(card == this.list[i]){
				this.list[i].seleccionada = true;
				this.seleccionada = true;
				console.log("Carta " + i + " seleccionada");
				return this.list[i];
			}
		};
		return null;
	};

	//VUELVE AL ESTADO this.selected = false DE UNA CARTA CONCRETA (recibe el indice de la carta)
	//Solo es llamado si hay una carta seleccionada previamente 
	//(Salta la carta no estaba seleccionada con PASAR Y GIRAR)
	this.soltar = function(card){
		var numCarta = null;
		for(i = 0; i < this.list.length; i++){
			if(card == this.list[i]){
				numCarta = i;
				break;
			};
		};
		if(numCarta > -1 && numCarta < this.list.length){
			if(this.list[numCarta].seleccionada == true){
				this.list[numCarta].seleccionada = false;
				this.seleccionada = false;
				console.log("Carta " + numCarta + " soltada");
				return null;
			} else {
				console.log("la carta no estaba seleccionada");
			};
		};
	};

	//length - 2 !!!
	this.updateHand = function(card, raton, girar){
		if(girar){
			card.girar();
		};
		if(card && this.numCarta === undefined){
			for (i = 0; i < this.list.length; i++) {
				if(this.list[i] == card){
					if(raton){
						//Cambia el tamaño de la carta si paso el raton por encima
						//pongo a done el indice de la carta cambiada
						this.list[i].setSize(72,108);
						this.numCarta = i;	//0 es false
					};
				};
			};
		} else if(!card && this.numCarta > -1 && this.numCarta < this.list.length){
			this.list[this.numCarta].setSize(60,90);
			this.numCarta = undefined;
		}
	};

	//redibujo en las nuevas coordenadas
	// Antes está copiada la mano por si acaso no puedo jugar la carta al soltarla
	this.mover = function(card,x,y){
		if(this.seleccionada){
//			console.log("muevo");
			card.x = x;
			card.y = y;
//			clearCanvas(canvas);
//			card.draw();
		};
	};

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