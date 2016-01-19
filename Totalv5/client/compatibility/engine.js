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
		console.log(acciones);
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

		if(accion[0] == null || (accion[1] == null && accion[2] == null && !accion[3])){
//			console.log("NO SE METE");
			return false;
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
			if(!error){
				if(result != false){
					console.log("------------------------");
					console.log(result);
					console.log(error);
					console.log("------------------------");
					//SI SE A JUGADO UNA CARTA DE DESCUBRIMIENTO, EL SERVER NOS DEVUELVE LA CARTA A DESTAPAR
					if(result != true){
						that.gameboard.board.list[fila][columna].setSprite(result.name);
					}
				}
			};
			//SI SE HA PODIDO JUGAR LA CARTA, TENGO QUE ACTUALIZAR LA MANO.
			var c = Caracteristicas.findOne({partidaId: that.partidaId,jugadorId: Meteor.userId()});
			that.gameboard.handboard = new HandBoard(c.mano,c.roll);

			that.inProcess = false;
		});
		console.log("carta jugada");
		return true;
	};

	//MANEJAR LOS CLICK SOBRE EL CANVAS
	this.selectPlay = function(x,y){
		//SI NO ES MI TURNO Y INPROCESS = 1 RETURN.
		if(!this.isMyTurn || this.inProcess){
			return;
		}
		var accion = this.gameboard.inRegion(x,y);
		if(accion == true){
			this.stopGame();
			loadCanvas(this.partidaId);
		}else{
			console.log(accion);
			var c = Caracteristicas.findOne({partidaId: that.partidaId,jugadorId: Meteor.userId()});
			that.gameboard.handboard = new HandBoard(c.mano,c.roll);
			return this.processPlay(accion);

//			return accion;
		}
		return;
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
		var over = false;
		var seleccionada = false;
		var carta = null;
		var cartaSeleccionada = null;

		$('#canvas').on( "mousemove", function( event ) {
	  		var x = event.pageX - offsetLeft;
	  		var y = event.pageY - offsetTop;

	  		if(!seleccionada){
		  		carta = that.gameboard.handboard.inRegion(x,y);
		  		if(carta && (!over)){
		 			that.gameboard.handboard.updateHand(carta);
		 			over = true;
		  		} else if(!carta){
		  			that.gameboard.handboard.updateHand(carta);
		  			over = false;
		  		}
		  	} else {
//	  			console.log("MOVER (" + x + "," + y + ")");
	  			that.gameboard.handboard.mover(cartaSeleccionada, x, y);
	  		}
		});
		
		$('#canvas').on("mousedown", function(event) {
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;

			console.log("has clickado en (" + x + "," + y + ")");
			carta = that.gameboard.handboard.inRegion(x,y);
			if(carta){
				cartaSeleccionada = carta;
				seleccionada = true;
//				var boleano = that.selectPlay(x,y);
			}
		});

		$('#canvas').on("mouseup", function(event) {
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;

			console.log("has soltado en (" + x + "," + y + ")");
			if(cartaSeleccionada){
				console.log("HAY CARTA SELECCIONADAAAAAAAAAAAA");
				var accion = that.selectPlay(x,y);
				console.log("mouseup " + accion);
				seleccionada = false;
			}
		});
/*
		$('#canvas').click(function(event) {
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;
			that.selectPlay(x,y);
		});
*/
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

		if(!that.stop){
			setTimeout(that.loop, 60);
		}
	};
};
