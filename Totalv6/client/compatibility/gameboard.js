var GameBoard = function(namesPlayers,cardsHand,roll) {
	BaseClass.call(this);
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

	this.createAccion = function(){
		var accion = [];
		accion.push(this.selectedCard);
		accion.push(this.selectedCoord);
		accion.push(this.selectedTarget);
		accion.push(this.selectedDiscard);

		return accion;
	};

	this.inRegion = function(x,y){
		//ANTES DE TODO PONER A NULL TARGET,COORD Y DISCARD
		this.selectedTarget = null;
		this.selectedCoord = null;
		this.selectedDiscard = false;
		//VER QUE SE SELECCIONA
		var r = this.handboard.inRegion(x,y);

//		console.log(r);
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

	this.draw = function(){
		drawRect("black",this.x,this.y,this.w,this.h);
		this.board.draw();
		this.pointsboard.draw();
		this.handboard.draw();
	};
};
