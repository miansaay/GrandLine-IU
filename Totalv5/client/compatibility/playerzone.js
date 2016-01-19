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

	this.changeObject = function(objeto){
		switch(objeto){
			case "farolillo":
				if(this.farol == "FarolOk"){
					this.farol = "FarolNo";
				}else{
					this.farol = "FarolOk";
				}
				break;
			case "vagoneta":
				if(this.vagon == "VagonOk"){
					this.vagon = "VagonNo";
				}else{
					this.vagon = "VagonOk";
				}
				break;
			case "pico":
				if(this.pico == "PicoOk"){
					this.pico = "PicoNo";
				}else{
					this.pico = "PicoOk";
				}
				break;
		}
	};

	this.drawObjects = function(){
		SpriteSheet.draw(this.farol, this.x, this.y + (this.h / 2), 40, 40, false);
		SpriteSheet.draw(this.vagon, this.x + 40, this.y + (this.h / 2), 40, 40, false);
		SpriteSheet.draw(this.pico, this.x + 80, this.y + (this.h / 2), 40, 40, false);
	};

	this.draw = function(){
		fillRect(this.fontColor,this.x, this.y, this.w, this.h);
		drawText(this.name,"black","20px Georgia",this.x,this.y + 40);
		drawRect("black",this.x,this.y,this.w,this.h);
		this.drawObjects();
	};
};