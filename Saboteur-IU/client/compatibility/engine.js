var tiposCartas = {
    camino1 : [1,4],
    camino2 : [1,5], //5,1 inversa,Tenemos que buscar como rotar la carta
    camino3 : [0,9],
    camino4 : [1,2],
    camino5 : [1,3],
    camino6 : [1,2], //2,1 inversa
    camino7 : [1,0],
    SinCamino1 : [0,4],//rotar
    SinCamino2 : [0,5],//rotar
    SinCamino4 : [0,0],
    SinCamino5 : [0,1],
    SinCamino6 : [0,4],//rotar
    SinCamino7 : [0,2],
    SinCamino8 : [0,8],
    SinCamino9 : [0,7],
    ComienzoEscalera : [3,0],
    DestinoNada1 : [3,3],
    DestinoNada2 : [3,2],
    DestinoPepita : [3,1],
    Saboteador : [5,0], //definir más adelante en función de los colores
    Minero : [4,0],//definir también en función de colores
    Pepitas1 : [2,7],
    Pepitas2 : [2,8],
    Pepitas3 : [2,9],
    RomperPico : [2,4],
    RomperVagoneta :[2,6],
    RomperFarolillo : [2,5],
    ArreglarVagoneta : [1,7],
    ArreglarPico : [1,8],
    ArreglarFarolillo : [1,9],
    ArreglarFaro_Vagon : [2,0],
    ArreglarFaro_Pico : [2,1],
    ArreglarVagon_Pico : [2,2],
    Mapa : [1,6],
    Derrumbamiento : [1,3],
    CRevesCamino : [3,4],
    CRevesDestino : [3,5],
    CRevesPepita : [3,7],
    CRevesPersonaje : [3,6],
}

// Objeto que pinta imagen perteneciente a una carta 
var imagenCartas = new function(){
	this.tipos = {};

	this.load = function(data, src){
		this.tipos = data;
		this.image = new Image();
		this.image.src = src;
	};

	this.draw = function(contexto, carta, x, y){
		var sx = this.tipos[carta][0];
		var sy = this.tipos[carta][1];

		//Las coordenadas están dadas las vuelta (primero columnas luego filas)
		contexto.drawImage(this.image, sy*90, sx*110, 90, 100, x, y, 60, 90);
	};
}

// Objeto Carta
var Carta = function(sprite, x, y){
	this.x = x;
	this.y = y;
	this.width = 60;
	this.height = 90;
	this.sprite = sprite;

	this.draw = function(contexto, carta){
		imagenCartas.draw(contexto, this.sprite, x, y);
		contexto.strokeStyle = "black";
		contexto.lineWidth = 1;
		contexto.strokeRect(this.x, this.y, this.width, this.height);
	};
}

//Objeto Tablero
var Tablero = function(context){
	this.x = 0;
	this.y = 0;
    this.cwidth = $('#canvas1').attr('width');
    this.cheight = $('#canvas1').attr('height');
    this.tablero = document.getElementById('tablero');
    context.drawImage(this. tablero,this.x, this.y, this.cwidth, this.cheight);
    
    //dibuja el tablero
    this.draw = function(contexto){
    	// Coordinadas de posiciones de ejemplo
    	for(i=0;i<2;i++){
		   	for(j=0;j<15;j++){
		   		contexto.strokeStyle = "black";
		   		contexto.strokeRect(j*60, i*90, 60, 90);
		  		contexto.font = "10px serif";
				contexto.textBaseline = "middle";
				contexto.fillText("[" + i + "," + j + "]", j*60+13, i*90+50);
			}
		}
   	};
}

var Game = function(){
//	console.log("[" + this.width + "," + this.height + "]");
	this.init = function(context){
		this.tablero = new Tablero(context);

		this.tablero.draw(context, 'images/tablero.jpg');

		imagenCartas.load(tiposCartas, 'images/sprites.png');
		// Prueba dibujando una carta
		var primera = new Carta("camino1", 0, 0);
		primera.draw(context);
	};
}