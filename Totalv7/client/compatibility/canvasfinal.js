//FINAL DE RONDA O PARTIDA
var canvasFinal = function(tipoGanador) {
	BaseClass.call(this);
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

	this.inRegion = function(carta,x,y){
		//AUX = [X,Y,W,H]
		var aux = [400,100,300,50];
		if(x >= aux[0] && x < aux[0] + aux[2] && y >= aux[1] && y < aux[1] + aux[3]){
			return true;
		}
		return false;
	};


	this.draw = function(){
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
};