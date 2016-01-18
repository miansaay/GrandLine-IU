//RECTANGULOS
function drawText(text,color,tipo,x,y){
	ctx.fillStyle = color;
	ctx.font = tipo;
	ctx.fillText(text,x,y);
};

function drawRect(color,x,y,w,h){
	ctx.strokeStyle = color;
  	ctx.lineWidth = 1;
	ctx.strokeRect(x,y,w,h);
};

function fillRect(color,x,y,w,h){
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}

// SPRITESHEET

var SpriteSheet = new function () {
	this.map = {};

	this.load = function(spriteData, src, callback) {
		this.map = spriteData;
		this.image = new Image();
		this.image.src = src;
		this.image.onload = callback;
	};

	this.draw = function(sprite, x, y, w, h, girada) {
		var img = this.map[sprite];
		ctx.save();
		if(girada){
			ctx.translate(x,y);
			ctx.translate(img.w/2,img.h/2);
			ctx.rotate(180*Math.PI/180);
			x = -30; y = -45;
		}
		ctx.drawImage(this.image, img.sx + img.frames * img.w, img.sy, img.w, img.h, x, y, w, h);
		ctx.restore();
	};
}

// BASE CLASS DE LA QUE SE HEREDA

var BaseClass = function(){

	this.initialize = function(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	};

	this.inRegion = function(x,y){
		if(x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h){
			return true;
		}
		return false;
	};
};


// CARD
var Card = function(x,y) {
	BaseClass.call(this);
	this.girada = false;
	this.color = "transparent";
	this.sprite = "Standard";
	this.seleccionada = false;
	this.initialize(x,y,60,90);

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

	this.draw = function(scroll){
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



// BOARD

var Board = function() {
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
};

Board.prototype = new BaseClass();

Board.prototype.selectCell = function(x,y){
	if(!this.inRegion(x,y)){
		return null;
	}

	var columna = Math.floor(x/60);
   	var fila = Math.floor(y/90);

   	return [(fila+this.scroll),columna];
};


Board.prototype.draw = function(){
	drawRect("black",this.x,this.y,this.w,this.h);
	for (i = this.scroll; i < this.scroll + 7; i++) {
		for (j = 0; j < 15; j++) {
			this.list[i][j].draw(this.scroll);
		};
	};
};


// POINTS TABLE

var PlayerZone = function(x,y,w,h){
	this.initialize(x,y,w,h);
	this.farol = "FarolOk";
	this.vagon = "VagonOk";
	this.pico = "PicoOk";
	this.fontColor = "yellow";

	this.setName = function(name){
		this.name = name;
	};

	this.changeObject = function(objeto){
		switch(objeto){
			case "farolillo":
				if(this.farol == "FarolOk"){
					this.farol = "FarolNo";
				}else{
					this.farol = "FarolOk";
				}
				break;
			case "vagoneta":
				if(this.vagon == "VagonOk"){
					this.vagon = "VagonNo";
				}else{
					this.vagon = "VagonOk";
				}
				break;
			case "pico":
				if(this.pico == "PicoOk"){
					this.pico = "PicoNo";
				}else{
					this.pico = "PicoOk";
				}
				break;
		}
	};

	this.drawObjects = function(){
		SpriteSheet.draw(this.farol, this.x, this.y + (this.h / 2));
		SpriteSheet.draw(this.vagon, this.x + 40, this.y + (this.h / 2));
		SpriteSheet.draw(this.pico, this.x + 80, this.y + (this.h / 2));
	};
};

PlayerZone.prototype = new BaseClass();

PlayerZone.prototype.draw = function(){
	fillRect(this.fontColor,this.x, this.y, this.w, this.h);
	drawText(this.name,"black","20px Georgia",this.x,this.y + 40);
	drawRect("black",this.x,this.y,this.w,this.h);
	this.drawObjects();
};


var PointsBoard = function(names) {
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

};

PointsBoard.prototype = new BaseClass();

PointsBoard.prototype.updateTarget = function(name,objeto){
	for (i = 0; i < this.list.length; i++) {
		if(this.list[i].name == name){
			this.list[i].changeObject(objeto);
		}
	};
};

PointsBoard.prototype.selectTarget = function(x,y){
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

PointsBoard.prototype.draw = function(){
	drawRect("black",this.x,this.y,this.w,this.h);
	for (i = 0; i < this.list.length; i++) {
		this.list[i].draw();
	};
};

// HAND CARDS

var HandBoard = function(cardsHand,roll) {
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
};

HandBoard.prototype = new BaseClass();

HandBoard.prototype.updateHand = function(card){
	for (i = 0; i < this.list.length - 2; i++) {
		this.list[i].setColor("transparent");
		this.list[i].setSize(60,90);
		if(this.list[i] === card){
//			this.list[i].setColor("yellow");
//			console.log("cambio tamaño");
			this.list[i].setSize(72,108);
		}
	};
};


HandBoard.prototype.inRegion = function(x,y){
	for (i = 0; i < this.list.length; i++) {
		var aux = this.list[i];
		if(aux.inRegion(x,y)){
			return aux;
		}
	};

	return null;
};

HandBoard.prototype.draw = function(){
	drawText(this.roll,"red","20px Georgia",this.x + 400,this.y + 30);
	drawRect("black",this.x,this.y,this.w,this.h);
//	console.log("dibujo mano");
	for (i = 0; i < this.list.length; i++) {
		this.list[i].draw();
	};
};

// GAMEBOARD(BOARD, POINTS TABLE, HAND CARDS)

var GameBoard = function(namesPlayers,cardsHand,roll) {
	this.initialize(0,0,1100,810);

	//BOARD, POINTBOARD, HANDBOARD
	this.board = new Board();
	this.pointsboard = new PointsBoard(namesPlayers);
	this.handboard = new HandBoard(cardsHand,roll);

	//CARTA SELECCIONADA
	this.selectedCard = null;
	//OBJETIVO SELECCIONADO
	this.selectedTarget = null;
	//FILA,COLUMNA SELECCIONADA
	this.selectedCoord = null;
	//DESCARTAR SELECCIONADO
	this.selectedDiscard = false;
};

GameBoard.prototype = new BaseClass();

GameBoard.prototype.createAccion = function(){
	var accion = [];
	accion.push(this.selectedCard);
	accion.push(this.selectedCoord);
	accion.push(this.selectedTarget);
	accion.push(this.selectedDiscard);

	return accion;
};

GameBoard.prototype.inRegion = function(x,y){
	//ANTES DE TODO PONER A NULL TARGET,COORD Y DISCARD
	this.selectedTarget = null;
	this.selectedCoord = null;
	this.selectedDiscard = false;
	//VER QUE SE SELECCIONA
	var r = this.handboard.inRegion(x,y);

	console.log(r);

	//SOLO LLAMO A BOARD Y POINTBOARD SI HAY CARTA SELECCIONADA
	if(this.selectedCard != null){
		this.selectedCoord = this.board.selectCell(x,y);
//		console.log(this.selectedCoord);
		this.selectedTarget = this.pointsboard.selectTarget(x,y);
	}

	//SI R NO ES NULL, HAY QUE COMPROBAR SI HAY QUE SELECCIONAR,PASAR O GIRAR.
	if(r != null){
		switch(r.text){
			case undefined:
				this.handboard.updateHand(r);
				this.selectedCard = r;
				break;
			case "GIRAR":
				if(this.selectedCard != null){
					this.selectedCard.girar();
				}
				break;
			case "PASAR":
				this.selectedDiscard = true;
				break;
		}
	}

	//RETORNO LA ACCION CON LA CARTA SELECCIONADA, Y DONDE SE PONE
	return this.createAccion();
};

GameBoard.prototype.draw = function(){
	drawRect("black",this.x,this.y,this.w,this.h);
	this.board.draw();
	this.pointsboard.draw();
	this.handboard.draw();
};


//FINAL DE RONDA O PARTIDA
var canvasFinal = function(tipoGanador) {
	this.initialize(0,0,1100,810);
	this.tipoGanador = tipoGanador;
	this.textSiguiente = "SIGUIENTE RONDA";
	this.ganadores = [];

	this.drawRonda = function(){
		ctx.strokeStyle = "red";
		ctx.strokeRect(this.x + this.w / 2 - 150,this.y + 100,300,50);
		ctx.font = "20px Georgia";
		ctx.fillText(this.textSiguiente,this.x + this.w / 2  - 100 , this.y + 130);
	};

	this.setGanadores = function(ganadores){
		this.textSiguiente = "FINALIZAR PARTIDA";
		this.ganadores = ganadores;
	};


};

canvasFinal.prototype = new BaseClass();

canvasFinal.prototype.inRegion = function(x,y){
	//AUX = [X,Y,W,H]
	var aux = [400,100,300,50];
	if(x >= aux[0] && x < aux[0] + aux[2] && y >= aux[1] && y < aux[1] + aux[3]){
		return true;
	}
	return false;
};


canvasFinal.prototype.draw = function(){
	if(this.textSiguiente == "SIGUIENTE RONDA"){
		ctx.fillStyle = "white";
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = "black";
		ctx.font = "50px Georgia";
		ctx.fillText("GANADOR: " + this.tipoGanador,this.x + this.w / 2 - 200,this.y + this.h/2);
	}else{
		ctx.fillStyle = "black";
		ctx.font = "20px Georgia";
		for(i = 0; i < this.ganadores.length; i++){
			ctx.fillText((i+1).toString() + ") " + this.ganadores[i], this.x + this.w / 2 - 100, this.y + this.h/2 + (i*50));
		};
	}
	this.drawRonda();
};

// TOTAL GAME

var Game = function(partidaId) {
	this.partidaId = partidaId;
	this.turnoTracker = null;
	this.accionTracker = null;
	this.inProcess = false;
	this.fondo = new Image();
	this.fondo.src = "sprites/tablero.jpg";
	this.accionId = null;
	this.stop = false;
	this.isMyTurn = false;
	this.handlers = false;
	that = this;


	this.updateAcciones = function(){
		var acciones = Acciones.find({partidaId: this.partidaId}).fetch();
		if(acciones.length > 0){
      		for (i = 0; i < acciones.length;i++) {
      			this.processAccion(acciones[i]);
      		};
    	}
	};


	//INICIALIZAR EL GAME
	this.initialize = function(spriteData,src,namesPlayers,cardsHand,roll) {
		this.gameboard = new GameBoard(namesPlayers,cardsHand,roll);
		this.updateAcciones();
		SpriteSheet.load(spriteData,src,this.loop);
	};

	//SI SE HACE CLICK FUERA DEL CANVAS DE PARA TODOS LOS LISTENER Y EL GAME
	this.stopGame = function(){
		this.stop = true;
		stopAll(this.accionTracker,this.turnoTracker);
	};

	//CON EL TRACKER SE VE SI CAMBIA EL TURNO
	this.updateTurno = function(turno){
		//SI HA ACABADO LA RONDA POINTSBOARD NO ESTA DEFINIDO Y RETORNO
		if(this.gameboard.pointsboard == undefined){
			return;
		}

		this.gameboard.pointsboard.updateTurno(turno);
		if(turno == Meteor.user().username){
			this.isMyTurn = true;
		}else{
			this.isMyTurn = false;
		}
	};

	//PROCESAR JUGADA
	this.processPlay = function(accion){
		//VARIABLES
		var action = "";
		var target = accion[2];
		var fila = -1;
		var columna = -1;

//		console.log(accion);
//		console.log(this);
//		console.log(that);
//		console.log("---------------------------------");

		if(accion[0] == null || (accion[1] == null && accion[2] == null && !accion[3])){
			return;
		}
		if(accion[3]){
			action = "descartar";
		}

		if(accion[1] != null){
			fila = accion[1][0];
			columna = accion[1][1];
		}

		//VARIABLE PARA NO DEJAR AL JUGADOR DAR MUCHOS CLICK Y CREAR POSIBLE FALLO.
		//INPROCESS = true -> NO SE PUEDEN HACER CLICKS
		this.inProcess = true;

		//CONSTRUIMOS CARTA
		var carta = {sprite: accion[0].sprite, fila: fila,columna:columna,girada: accion[0].girada};

		//METEOR CALL JUGAR CARTA
		Meteor.call("jugarCarta",that.partidaId,action,carta,target, function(error,result) {
			if(result != false){
				//SI SE A JUGADO UNA CARTA DE DESCUBRIMIENTO, EL SERVER NOS DEVUELVE LA CARTA A DESTAPAR
				if(result != true){
					that.gameboard.board.list[fila][columna].setSprite(result.name);
				}
				//SI SE HA PODIDO JUGAR LA CARTA, TENGO QUE ACTUALIZAR LA MANO.
				var c = Caracteristicas.findOne({partidaId: that.partidaId,jugadorId: Meteor.userId()});
				that.gameboard.handboard = new HandBoard(c.mano,c.roll);
			}
			that.inProcess = false;
		});
	};

	//MANEJAR LOS CLICK SOBRE EL CANVAS
	this.selectPlay = function(x,y){
		//SI NO ES MI TURNO Y INPROCESS = 1 RETURN.
		if(!this.isMyTurn || this.inProcess){
			return;
		}

//		console.log(this);
//		console.log(that);
//		console.log("---------------------------------");
		var accion = this.gameboard.inRegion(x,y);
		if(accion == true){
			this.stopGame();
			loadCanvas(this.partidaId);
		}else{
			console.log(accion);
			this.processPlay(accion);
		}
	};

	//MANEJAR LAS ACCIONES
	this.processAccion = function(accion){
		switch(accion.tipo){
			case "excavacion":
				that.gameboard.board.list[accion.carta.fila][accion.carta.columna].setSprite(accion.carta.sprite);
				that.gameboard.board.list[accion.carta.fila][accion.carta.columna].girada = accion.carta.girada;
				break;
			case "accionP":
				if(accion.carta.sprite.charAt(0) == 'A'){
					var objeto = accion.carta.sprite.toLowerCase().split("arreglar");
				}else{
					var objeto = accion.carta.sprite.toLowerCase().split("romper");
				}
				that.gameboard.pointsboard.updateTarget(accion.targetName,objeto[1]);
				break;
			case "accionT":
				that.gameboard.board.list[accion.carta.fila][accion.carta.columna].setSprite("Standard");
				break;
			case "finalRonda":
				that.isMyTurn = true;
				that.gameboard = new canvasFinal(accion.tipoGanador);
				break;
			case "finalPartida":
				that.isMyTurn = true;
				that.gameboard = new canvasFinal(accion.tipoGanador);
				that.gameboard.setGanadores(accion.ganadores);
				break;
			case "doble":
				//la primera es la carta
			  	that.gameboard.board.list[accion.primera.fila][accion.primera.columna].setSprite(accion.primera.sprite);
			  	that.gameboard.board.list[accion.primera.fila][accion.primera.columna].girada = accion.primera.girada;
			  	//la segunda la de destino
				that.gameboard.board.list[accion.segunda.fila][accion.segunda.columna].setSprite(accion.segunda.sprite);
			  	that.gameboard.board.list[accion.segunda.fila][accion.segunda.columna].girada = accion.segunda.girada;
				break;
		}
	};

	this.onListeners = function(){
		console.log("AGREGO LISTENERS");
		$('#canvas').on( "mousemove", function( event ) {
	//		console.log(event);
	  		var x = event.pageX - offsetLeft;
	  		var y = event.pageY - offsetTop;

	  		var seleccionada = that.gameboard.handboard.inRegion(x,y);
//	  		console.log(accion);

//	 	    console.log(seleccionada);
	 		that.gameboard.handboard.updateHand(seleccionada);
		});
		
		$('#canvas').on("mousedown", function(event) {
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;

			console.log("has clickado en (" + x + "," + y + ")");
		});

		$('#canvas').on("mouseup", function(event) {
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;

			console.log("has soltado en (" + x + "," + y + ")");
		});

		$('#canvas').click(function(event) {
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;
//			console.log(this);
//			console.log(that);
//			console.log("--------------------------------");
			that.selectPlay(x,y);
		});
	};

	this.offListeners = function(){
		console.log("elimino listeners");
		$('#canvas').off();
	};

	//LOOP DEL GAME
	this.loop = function(){
		if(that.isMyTurn && !that.handlers){
			that.onListeners();
			that.handlers = true;
		}else if(!that.isMyTurn && that.handlers){
			that.offListeners();
			that.handlers = false;
		}

		ctx.drawImage(that.fondo,0,0,1100,810);
		that.gameboard.draw();

//		console.log("[" + cursorX + "," + cursorY + "]");
		if(!that.stop){
			setTimeout(that.loop, 60);
		}
	};
};
