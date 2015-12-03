// Clase juego de única instancia
var Game = new function() {                                                                  
  var boards = [];

  // Game Initialization
  this.initialize = function(canvas,sprite_data,callback) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height= canvas.height;
    this.ctx = canvas.getContext && canvas.getContext('2d');

    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();

    this.loop(); 

    SpriteSheet.load(sprite_data,callback);
  };

  // Handle Input
  var KEY_CODES = { mouseup:'raton', mousedown:'raton', 39:'right', 32 :'fire' };
  this.keys = {};
  this.position = [];

  this.setupInput = function() {
    Game.canvas.addEventListener('mousedown',function(event) {
      if(KEY_CODES[event.type]) {
        Game.keys[KEY_CODES[event.type]] = true;
        event.preventDefault();
      }
    },false);

    Game.canvas.addEventListener('mouseup',function(event) {
      if(KEY_CODES[event.type]) {
        Game.keys[KEY_CODES[event.type]] = false;
        event.preventDefault();
      }
    },false);

    Game.canvas.addEventListener('mousemove', function(event){
      var offset = Game.canvas.getBoundingClientRect();
      var x = event.clientX - offset.left;
      var y = event.clientY - offset.top;
      Game.position[0] = x;
      Game.position[1] = y;
    });
  }

  // Game Loop
  this.loop = function() { 
    var dt = 30 / 1000;

    for(var i=0,len = boards.length;i<len;i++) {
      if(boards[i]) { 
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    console.log("REFRESCO");
    setTimeout(Game.loop,1);
  };
  
  // Cambia de tablero
  this.setBoard = function(num,board) { 
    boards[num] = board;
    console.log("AGREGAdO TABLERO");
  };
};

var SpriteSheet = new function() {
  this.map = { }; 

  this.load = function(spriteData,callback) { 
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };

  this.draw = function(canvas,sprite,x,y,frame) {
      var ctx = canvas.getContext('2d');
      var s = this.map[sprite];
      var sx = s[0];
      var sy = s[1];
      var swidth = 90;
      var sheight = 110;
      var cWidth = ctx.width;
      var cHeight = ctx.height;

      ctx.drawImage(this.image, sx*swidth, sy*sheight, swidth, sheight, x, y, 60, 90);
  }
}

  //Objeto GameBoard
  var GameBoard = function() {
    var board = this;

    this.objects = [];

    this.add = function(obj) {
      obj.board=this; 
      this.objects.push(obj); 
      return obj; 
    };

    // Marca un objeto para ser borrado
    this.remove = function(obj) { 
      this.removed.push(obj); 
    };

    // Resetea la lista de objetos borrados
    this.resetRemoved = function() { this.removed = []; }

    // borra objetos marcados para borrar de la lista
    this.finalizeRemoved = function() {
      for(var i=0,len=this.removed.length;i<len;i++) {
        var idx = this.objects.indexOf(this.removed[i]);
        if(idx != -1){
          this.objects.splice(idx,1);
          this.removed.splice(idx,1);
        }
      }
    }


    // Itera sobre los objetos del Board
    // Ejecutando el step de cada uno y los marca para borrar 
    this.iterate = function(funcName) {
       var args = Array.prototype.slice.call(arguments,1);
       for(var i=0,len=this.objects.length;i<len;i++) {
         var obj = this.objects[i];
         obj[funcName].apply(obj,args);
         this.remove(obj);
       }
    };

    // Encuentra el primer objecto para el cual func es true
    this.detect = function(func) {
      for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
        if(func.call(this.objects[i])) return this.objects[i];
      }
      return false;
    };

    // LLama el step de cada objeto y lo borra
    this.step = function(dt) { 
      this.resetRemoved();
      this.iterate('step',dt);
      this.finalizeRemoved();
    };

    // punta todos los objetos
    this.draw= function(ctx) {
      this.iterate('draw',ctx);
    };
  }