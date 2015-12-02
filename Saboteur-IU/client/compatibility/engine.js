// Clase juego de única instancia
var Game = new function() {                                                                  
  var boards = [];

  // Game Initialization
  this.initialize = function(canvasElementId,sprite_data,callback) {
    this.canvas = document.getElementById(canvasElementId)
    console.log(this.canvas);
    this.width = this.canvas.width;
    this.height= this.canvas.height;

    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if(!this.ctx) { return alert("Please upgrade your browser to play"); }

    this.setupInput();

    this.loop(); 

    SpriteSheet.load(sprite_data,callback);
  };

  // Handle Input
  var KEY_CODES = { 37:'left', 39:'right', 32 :'fire' };
  this.keys = {};

  this.setupInput = function() {
    window.addEventListener('mousedown',function(event) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = true;
       event.preventDefault();
      }
    },false);

    window.addEventListener('mouseup',function(event) {
      if(KEY_CODES[event.keyCode]) {
       Game.keys[KEY_CODES[event.keyCode]] = false; 
       event.preventDefault();
      }
    },false);
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
    setTimeout(Game.loop,1000);
  };
  
  // Change an active game board
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

  this.draw = function(ctx,sprite,x,y,frame) {
    var s = this.map[sprite];
/* Dibujaria las cartas en un sitio aleatorio cada vez
// Por ahora no sirve
    if(!frame) frame = 0;
    ctx.drawImage(this.image,
                     s.sx + frame * s.w, 
                     s.sy, 
                     s.w, s.h, 
                     Math.floor(x), Math.floor(y),
                     s.w, s.h);
  };
*/
  }
}

  //Objeto GameBoard
  var GameBoard = function() {
    var board = this;

    console.log(board);

    // The current list of objects
    this.objects = [];
  //  console.log(objects);

    // Add a new object to the object list
    this.add = function(obj) { 
      obj.board=this; 
      this.objects.push(obj); 
      return obj; 
    };

    // Mark an object for removal
    this.remove = function(obj) { 
      this.removed.push(obj); 
    };

    // Reset the list of removed objects
    this.resetRemoved = function() { this.removed = []; }

    // Removed an objects marked for removal from the list
    this.finalizeRemoved = function() {
      for(var i=0,len=this.removed.length;i<len;i++) {
        var idx = this.objects.indexOf(this.removed[i]);
        if(idx != -1) this.objects.splice(idx,1);
      }
    }


    // Call the same method on all current objects 
    this.iterate = function(funcName) {
      console.log(arguments);
       var args = Array.prototype.slice.call(arguments,1);
  //     console.log(args);
       for(var i=0,len=this.objects.length;i<len;i++) {
         var obj = this.objects[i];
  //       console.log(obj[funcName]);
         obj[funcName].apply(obj,args)
       }
    };

    // Find the first object for which func is true
    this.detect = function(func) {
      for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
        if(func.call(this.objects[i])) return this.objects[i];
      }
      return false;
    };

    // Call step on all objects and them delete
    // any object that have been marked for removal
    this.step = function(dt) { 
      this.resetRemoved();
      this.iterate('step',dt);
      this.finalizeRemoved();
    };

    // Draw all the objects
    this.draw= function(ctx) {
      this.iterate('draw',ctx);
    };
  }