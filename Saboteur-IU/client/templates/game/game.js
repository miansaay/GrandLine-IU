Meteor.startup(function(){
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
      Game.setBoard(0, new tablero(canvas, true));
  }

  window.addEventListener("load", function() {
    console.log("cargando");

    //Localizo el canvas que voy a utilizar
    canvas = document.getElementById('canvas1');
    Game.initialize(canvas, sprites, startGame);
  });

  var Carta = function(nombreCarta){
    this.carta = nombreCarta;
    this.x = sprites[this.carta][0];
    this.y = sprites[this.carta][1];
    this.cWidth = 0;
    this.cHeight = 0;
    this.selected = false;

    this.step = function(dt){
      if(Game.keys['raton'] === true){
        console.log("carta seleccionada");
        this.selected = true;
        this.cWidth = Game.position[0];
        this.cHeight = Game.position[1];
      } else {
        this.selected = false;
      }
    }

    this.draw = function(canvas, x, y){
      SpriteSheet.draw(canvas, nombreCarta, this.cWidth, this.cHeight);
    }
  };

  var tablero = function(canvas){
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.cartas = [];
      this.carta = new Carta("RomperVagoneta");
      this.board = new GameBoard();

      this.clear =function(){
        this.ctx.fillStyle = 'rgba(255,255,255,1)';
        this.ctx.fillRect(0,0,Game.canvas.width,Game.canvas.height);

      }

      this.step = function(dt) {
        this.clear();
        this.board.add(this.carta);
//        console.log("carta agregada");
        this.board.step(dt);  
      }

      this.draw = function() {
//        console.log(this.board);
//          console.log("DIBUJO CARTA EN");
//          console.log(this.carta.cWidth + "," + this.carta.cHeight);
          this.carta.draw(this.canvas, this.carta.cWidht, this.carta.cHeight);
      }
  };
});