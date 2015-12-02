//Diccionario de cartas
var sprites = {
  camino1 : [4,1],
  camino2 : [5,1], //5,1 inversa,Tenemos que buscar como rotar la carta
  camino3 : [9,0],
  camino4 : [2,1],
  camino5 : [3,1],
  camino6 : [2,1], //2,1 inversa
  camino7 : [0,1],
  SinCamino1 : [4,0],//rotar
  SinCamino2 : [5,0],//rotar
  SinCamino4 : [0,0],
  SinCamino5 : [1,0],
  SinCamino6 : [4,0],//rotar
  SinCamino7 : [2,0],
  SinCamino8 : [8,0],
  SinCamino9 : [7,0],
  ComienzoEscalera : [0,3],
  DestinoNada1 : [3,3],
  DestinoNada2 : [2,3],
  DestinoPepita : [1,3],
  Saboteador : [0,5], //definir más adelante en función de los colores
  Minero : [0,4],//definir también en función de colores
  Pepitas1 : [7,2],
  Pepitas2 : [8,2],
  Pepitas3 : [9,2],
  RomperPico : [4,2],
  RomperVagoneta :[6,2],
  RomperFarolillo : [5,2],
  ArreglarVagoneta : [7,1],
  ArreglarPico : [8,1],
  ArreglarFarolillo : [9,1],
  ArreglarFaro_Vagon : [0,2],
  ArreglarFaro_Pico : [1,2],
  ArreglarVagon_Pico : [2,2],
  Mapa : [6,1],
  Derrumbamiento : [3,1],
  CRevesCamino : [4,3],
  CRevesDestino : [5,3],
  CRevesPepita : [7,3],
  CRevesPersonaje : [6,3],
}

var startGame = function(){
    console.log("startGame");
    Game.setBoard(0, new Tabla(true));
}

window.addEventListener("load", function() {
  console.log("PRIMERO");
  Game.initialize("canvas1", sprites, startGame);
});

var Tabla = function(clear){
    //Set up the offscreen canvas
    var tablero = document.createElement('canvas');
    tablero.width = Game.width;
    tablero.height = Game.height;

    var tableroCtx = tablero.getContext('2d');

    if(clear) {
       tableroCtx.fillStyle = "#FF0000";
       tableroCtx.fillRect(0,0,tablero.width,tablero.height);
    }

    this.draw = function(ctx) {

    }

    // This method is called to update
    // the starfield
    this.step = function(dt) {
    //  offset += dt * speed;
    //  offset = offset % stars.height;
    }
}

var Carta = function(x,y, nombreCarta){
  this.x = x;
  this.y = y;
  this.carta = sprites[nombreCarta];

  this.step = function(dt){

  }

  this.draw = function(ctx){
    SpriteSheet.draw(ctx, this.carta, 0,0);
  }
} 

Card = new Carta(0, 0, "camino1");
canvas1 = document.getElementById('canvas1')
Card.draw(canvas1);