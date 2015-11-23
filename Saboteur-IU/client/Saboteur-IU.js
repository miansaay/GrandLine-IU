// Posiciones = new Meteor.Collection('cartas');

	var cartas = new Object(); 
	var context = new Object();

	Router.configure({
  		layoutTemplate: 'main'
	});


	if (Meteor.isClient) {  
		
	  	Template.play.onRendered(function(){

		  var canvas = document.getElementById('canvas1');
		  cartas = document.getElementById('cartas');
		  context = canvas.getContext('2d');

	      var newGame = new Game();
	      newGame.init(context);
	  });

	  Template.play.events({
	    'mousedown #canvas1': function(event){
	      var x = event.offsetX;
	      var y = event.offsetY;
	      console.log("has pulsado: [" + x + "," + y + "]");
	      imagenCartas.draw(context, cartas, "camino1", x, y);

	    },

	    'mouseup #canvas1': function(event){
	      var x = event.offsetX;
	      var y = event.offsetY;
	      console.log("has soltado en: [" + x + "," + y + "]");
	    }
	  });
	}
