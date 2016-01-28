// POINTS TABLE
var PlayerZone = function(x,y,w,h){
	BaseClass.call(this);
	this.initialize(x,y,w,h);
	this.farol = "FarolOk";
	this.vagon = "VagonOk";
	this.pico = "PicoOk";
	this.fontColor = "yellow";

	this.setName = function(name){
		this.name = name;
	};

		this.fixObject = function(objeto){
		switch(objeto){
			case "farolillo":
				this.farol = "FarolOk";
				sonido = new buzz.sound('audio/farolOk.mp3');
				sonido.play();
				break;
			case "vagoneta":
				this.vagon = "VagonOk";
				sonido = new buzz.sound('audio/vagonetaOk.mp3');
				sonido.play();
				break;
			case "pico":
				this.pico = "PicoOk";
				sonido = new buzz.sound('audio/picoOk.mp3');
				sonido.play();
				break;
		}
	};

	this.breakObject = function(objeto){
		switch(objeto){
			case "farolillo":
				this.farol = "FarolNo";
				sonido = new buzz.sound('audio/farolNo.mp3');
				sonido.play();
				break;
			case "vagoneta":
				this.vagon = "VagonNo";
				sonido = new buzz.sound('audio/vagonetaNo.mp3');
				sonido.play();
				break;
			case "pico":
				this.pico = "PicoNo";
				sonido = new buzz.sound('audio/picoNo.mp3');
				sonido.play();
				break;
		}
	};

	this.drawObjects = function(){
		SpriteSheet.draw(this.farol, this.x + 40, this.y + (this.h / 2), 40, 40, false);
		SpriteSheet.draw(this.vagon, this.x + 80, this.y + (this.h / 2), 40, 40, false);
		SpriteSheet.draw(this.pico, this.x + 120, this.y + (this.h / 2), 40, 40, false);
	};

	this.draw = function(){
		fillRect(this.fontColor,this.x, this.y, this.w, this.h);
		drawText(this.name,"black","20px Georgia",this.x + 40,this.y + 40);
		drawRect("black",this.x,this.y,this.w,this.h);
		this.drawObjects();
	};
};
