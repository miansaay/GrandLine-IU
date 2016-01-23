var canvas;
var ctx;
var offsetLeft;
var offsetTop;

var cursorX;
var cursorY;

var sprites = {

	//CAMINO
	Camino1:			{sx: 0, sy: 0, w: 60, h: 90, frames: 9},
	Camino2:			{sx: 0, sy: 90, w: 60, h: 90, frames: 0},
	Camino3:			{sx: 0, sy: 90, w: 60, h: 90, frames: 1},
	Camino4:			{sx: 0, sy: 90, w: 60, h: 90, frames: 2},
	Camino5:			{sx: 0, sy: 90, w: 60, h: 90, frames: 3},
	Camino6:			{sx: 0, sy: 90, w: 60, h: 90, frames: 4},
	Camino7:			{sx: 0, sy: 90, w: 60, h: 90, frames: 5},

	//SIN CAMINO
	SinCamino1: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 0},
	SinCamino2: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 1},
	SinCamino3: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 2},
	SinCamino4: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 3},
	SinCamino5: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 4},
	SinCamino6: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 5},
	SinCamino7: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 6},
	SinCamino8: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 7},
	SinCamino9: 		{sx: 0, sy: 0, w: 60, h: 90, frames: 8},

	//CAMINO ATRAS
	CaminoAtras: 		{sx: 0, sy: 270, w: 60, h: 90, frames: 4},

	//COMIENZO
	ComienzoEscalera: 	{sx: 0, sy: 270, w: 60, h: 90, frames: 0},

	//DESTINO ALANTE
	DestinoNada1: 		{sx: 0, sy: 270, w: 60, h: 90, frames: 2},
	DestinoNada2: 		{sx: 0, sy: 270, w: 60, h: 90, frames: 3},
	DestinoPepita: 		{sx: 0, sy: 270, w: 60, h: 90, frames: 1},

	//DESTINO ATRAS
	DestinoAtras: 		{sx: 0, sy: 270, w: 60, h: 90, frames: 5},


	//DESCUBRIR DESTINO
	Mapa: 				{sx: 0, sy: 90, w: 60, h: 90, frames: 6},

	//DERRUMBAMIENTO
	Derrumbamiento: 	{sx: 0, sy: 180, w: 60, h: 90, frames: 3},

	//ARREGLAR
	ArreglarVagoneta: 	{sx: 0, sy: 90, w: 60, h: 90, frames: 7},
	ArreglarPico: 		{sx: 0, sy: 90, w: 60, h: 90, frames: 8},
	ArreglarFarolillo: 	{sx: 0, sy: 90, w: 60, h: 90, frames: 9},

	ArreglarFaro_Vagon: {sx: 0, sy: 180, w: 60, h: 90, frames: 0},
	ArreglarFaro_Pico: 	{sx: 0, sy: 180, w: 60, h: 90, frames: 1},
	ArreglarVagon_Pico: {sx: 0, sy: 180, w: 60, h: 90, frames: 2},

	//ROMPER
	RomperPico: 		{sx: 0, sy: 180, w: 60, h: 90, frames: 4},
	RomperFarolillo: 	{sx: 0, sy: 180, w: 60, h: 90, frames: 5},
	RomperVagoneta: 	{sx: 0, sy: 180, w: 60, h: 90, frames: 6},


	//STANDAR
	Standard:			{sx: 0, sy: 720, w: 60, h: 90, frames: 0},

	//ICONOS OBJETOS
	PicoOk: 			{sx: 0, sy: 540, w: 40, h: 40, frames: 1},
	FarolOk: 			{sx: 0, sy: 580, w: 40, h: 40, frames: 1},
	VagonOk:  			{sx: 0, sy: 620, w: 40, h: 40, frames: 1},

	PicoNo:  			{sx: 0, sy: 540, w: 40, h: 40, frames: 0},
	FarolNo:  			{sx: 0, sy: 580, w: 40, h: 40, frames: 0},
	VagonNo:  			{sx: 0, sy: 620, w: 40, h: 40, frames: 0},

	//SABOTEADOR Y MINERO
	Saboteador:  		{sx: 0, sy: 450, w: 60, h: 90, frames: 0},
	Buscador:  			{sx: 0, sy: 360, w: 60, h: 90, frames: 0},

};

var sound = new buzz.sound('audio/introJuego2.wav');
sound.loop().play();

var loadCanvas = function(partidaId){
	sound.unloop().stop();
	$(".total-board").show();
  	$(".match-board").show();
  	if(!canvas){
		canvas = document.getElementById('canvas');
		offsetLeft = $(canvas).offset().left;
		offsetTop = $(canvas).offset().top;
		var audio = new buzz.sound('audio/barajar.mp3');
		audio.play();
		ctx = canvas.getContext && canvas.getContext("2d");
		canvas.width = 1100;
		canvas.height = 810;
		//audio.stop();

	}

	var p = Partidas.findOne({_id: partidaId});
	var c = Caracteristicas.findOne({partidaId: partidaId,jugadorId: Meteor.userId()});

	var newGame = new Game(partidaId);
	newGame.initialize(sprites,"sprites/sprites.png",p.listaJugadores,c.mano,c.roll);

	offListener(newGame);
	clickListener(newGame);

	runTracker(partidaId,newGame);

};


//LISTENER DEL CLICK SOBRE CANVAS
var clickListener = function(game){
	console.log("CARGADO");
/*	$('#canvas').click(function(event) {
		var x = event.pageX - offsetLeft;
		var y = event.pageY - offsetTop;
		game.selectPlay(x,y);
	});
*/
};


//LISTENER DEL CLICK FUERA DEL CANVAS
var offListener = function(game){
	$('.total-board').click(function(event) {
		game.stopGame();
	});
};


//TRACKER PARA ACTUALIZAR EL TURNO Y PROCESAR ACCIONES NUEVAS
var runTracker = function(partidaId,game){
	// TRACKER DEL TURNO
	var turnoTracker = Tracker.autorun(function(){
//		console.log("tracker de turno");
		var turno = Partidas.findOne({_id: partidaId}).jugadorActivo;
		game.updateTurno(turno);
	});

	//TRACKER DE ACCIONES
	var accionTracker = Tracker.autorun(function(){
//		console.log("tracker de accion");
		var accion = Acciones.findOne({partidaId: partidaId},{sort: {datetime: -1,limit: 1}});
		var usuario = Meteor.user().username;

//		console.log("ACCION de " + usuario);
//		console.log(accion);
		if(accion){
			game.processAccion(accion);
		}
	});
	game.turnoTracker = turnoTracker;
	game.accionTracker = accionTracker;
};

//FUNCION QUE LLAMA GAME PARA PARAR TODOS LOS EVENT LISTENERS Y TRACKERS
var stopAll = function(accionTracker,turnoTracker){
	turnoTracker.stop();
	accionTracker.stop();
	$(".total-board").hide();
	$(".match-board").hide();
	$(".total-board").off();
	$('#canvas').off();
};
