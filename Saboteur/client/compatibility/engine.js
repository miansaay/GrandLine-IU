//Funcion para limpiar el canvas
function clearCanvas(canvas){
	canvas.width = canvas.width; //Dumb way to clear canvas
};

//Dibuja texto
function drawText(text,color,tipo,x,y){
	ctx.fillStyle = color;
	ctx.font = tipo;
	ctx.fillText(text,x,y);
};

//Dibuja rectancgulos
function drawRect(color,x,y,w,h){
	ctx.strokeStyle = color;
  	ctx.lineWidth = 1;
	ctx.strokeRect(x,y,w,h);
};

//Rellena rectangulos
function fillRect(color,x,y,w,h){
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}

//Para el sistema durante los milisegundos especificados
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
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
/*		console.log("--------------------");
		console.log(sprite);
		console.log("............................");
*/
		var img = this.map[sprite];
		ctx.save();
		if(girada){
//			console.log("GIRANDO EL DIBUJO");
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
	this.fondomano = new Image();
	this.fondomano.src = "sprites/tapete.jpg";
	this.fondojug = new Image();
	this.fondojug.src = "sprites/fondojug.jpg"
	this.accionId = null;
	this.stop = false;
	this.isMyTurn = false;
	this.end = false;
	that = this;


	this.initAcciones = function(){
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
		this.initAcciones();
		SpriteSheet.load(spriteData,src,this.loop);
	};

	//SI SE HACE CLICK FUERA DEL CANVAS DE PARA TODOS LOS LISTENER Y EL GAME
	this.stopGame = function(){
		this.stop = true;
		this.offListeners();
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

//		console.log("ACCION EN PROCCESS PLAY");
//		console.log(accion)


		if(accion[0] == null || (accion[1] == null && accion[2] == null && !accion[3])){
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
//					console.log("------------------------");
//					console.log(result);
//					console.log("------------------------");
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
		return true;
	};

	//MANEJAR LOS CLICK SOBRE EL CANVAS
	this.selectPlay = function(carta, x,y){
		//SI NO ES MI TURNO Y INPROCESS = 1 RETURN.
		console.log("ENTRO EN SELECTPLAY");
		if(!this.isMyTurn || this.inProcess){
			return;
		}
		var accion = this.gameboard.inRegion(carta, x, y);
//		console.log("ACCION EN SELECTPLAY");
//		console.log(accion);
		if(accion == true){
			this.stopGame();
//			console.log("CARGO DE NUEVO EL CANVAS");
			loadCanvas(this.partidaId);
		}else{
			return this.processPlay(accion);
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
				console.log("FINAL DE LA RONDA");
				that.isMyTurn = true;
				that.end = true;
				that.gameboard = new canvasFinal(accion.tipoGanador);
				break;
			case "finalPartida":
				console.log("FINAL DE LA PARTIDA");
				that.isMyTurn = true;
				that.end = true;
				that.gameboard = new canvasFinal(accion.tipoGanador);
				that.gameboard.setGanadores(accion.ganadores);
				that.stopGame();
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

	//ACTIVA LOS LISTENERS CUANDO HA TERMINADO LA RONDA
	//LUEGO DA ERROR EL CANVAS FINAL
	this.onListeners = function(){
		console.log("AGREGO LISTENERS");
		var over = false;
		var seleccionada = false;
		var carta = null;
		var cartaSeleccionada = null;
		var moviendo = false;
		var accion = true;
		var init_y_scroll;
		var scroll=false;
		var distanciax;
		var distanciay;
		console.log(that.gameboard);
		if(that.gameboard.handboard != undefined){
			console.log("CREO MAZOAUX");
			var mazoAux = new Array(that.gameboard.handboard.length);
		}



		$('#canvas').on( "mousemove", function( event ) {
			event.preventDefault();
	  		var x = event.pageX - offsetLeft;
	  		var y = event.pageY - offsetTop;

	  		if(that.isMyTurn && !that.end){
		  		if(!cartaSeleccionada){
			  		carta = that.gameboard.handboard.inRegion(x,y);
			  		if(carta && (!over)){
			  			over = true;
			 			that.gameboard.handboard.updateHand(carta, over, false);
			  		} else if(!carta && over){
			  			over = false;
			  			that.gameboard.handboard.updateHand(carta, over, false);
			  		}else if (scroll){
			  			console.log(that.gameboard.board.scroll)

			  			distancia=y-init_y_scroll

			  			n_scroll=parseInt(distancia/90)

			  			console.log(distancia)

			  			console.log(n_scroll)

			  			if (n_scroll==1){
			  				that.gameboard.board.scroll=that.gameboard.board.scroll-1
			  				init_y_scroll=init_y_scroll+90

			  			}else if (n_scroll==-1){
			  				that.gameboard.board.scroll=that.gameboard.board.scroll+1
			  				init_y_scroll=init_y_scroll-90
			  			}





			  		}
			  	} else {	//Solo entra si hay una carta seleccionada
			  		if(!moviendo){
			  			// Creo una copia de la mano que tengo
			  			mazoAux = that.gameboard.handboard.copiar();
			  			moviendo = true;

			  		} else {
		  				that.gameboard.handboard.mover(cartaSeleccionada, x-distanciax, y-distanciay);
		  			}
		  		}
		  	}

		});

		$('#canvas').on("mousedown", function(event) {
			event.preventDefault();
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;


			if(that.isMyTurn || !that.end){
				if(carta){
					distanciax=(x-carta.x);
					distanciay=(y-carta.y);

					cartaSeleccionada = that.gameboard.handboard.seleccionar(carta);
					audio = new buzz.sound('audio/carta3.mp3');
					audio.play();
				}else{
					scroll=true
					init_y_scroll  = y;

				}
			}
		});

		$('#canvas').on("dblclick", function(event){
			event.preventDefault();
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;

			if(that.isMyTurn && !that.end){
				carta = that.gameboard.handboard.inRegion(x,y);
				if(carta){
					var girar = true;
					that.gameboard.handboard.updateHand(carta, false, girar);
				};
			};
		});

		$('#canvas').on("mouseup", function(event) {
			event.preventDefault();
			var x = event.pageX - offsetLeft;
			var y = event.pageY - offsetTop;

			if(that.isMyTurn && !that.end){
				var descarte=false

				if (( x>=750 && x<=810) && ( y>=680 && y<=770)) {
					var descarte=true
				}

				if (scroll){
					scroll=false
				}

				if(cartaSeleccionada){
					that.gameboard.handboard.soltar(cartaSeleccionada);
					cartaSeleccionada = null;
					over = false;
					var audio = new buzz.sound('audio/carta3.mp3');
					audio.play();
					if(moviendo){
						var accion = that.selectPlay(carta, x,y);
						if(accion){
							that.gameboard.handboard = mazoAux.copiar();
						}
						that.gameboard.handboard.updateHand(cartaSeleccionada, over, false);
						moviendo = false;
					}
				};
			} else {
				console.log("FINAL");
				that.selectPlay(null, x, y);
			}
		});
	};

	this.offListeners = function(){
		console.log("elimino listeners");
		$('#canvas').off();
	};

	//LOOP DEL GAME
	this.loop = function(){
		clearCanvas(canvas);

		ctx.drawImage(that.fondo,0,0,1100,810);
		ctx.drawImage(that.fondomano,0,630,900,180);
		ctx.drawImage(that.fondojug, 900,0,200,810);
		that.gameboard.draw();

		if(!that.stop){
			setTimeout(that.loop, 30);		// MIRAR COMO CAMBIAR ESTO A FPS
		}
	};
};
