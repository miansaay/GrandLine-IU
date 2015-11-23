// Posiciones = new Meteor.Collection('cartas');

Router.configure({
  layoutTemplate: 'main'
});


if (Meteor.isClient) {  
  Template.play.onRendered(function(){
      var canvas = document.getElementById('canvas1');
      var ctx = canvas.getContext('2d');

      var newGame = new Game();
      newGame.init(ctx);
  });

  Template.play.events({
    'mousedown #canvas1': function(event){
      var x = event.offsetX;
      var y = event.offsetY;
      console.log("has pulsado: [" + x + "," + y + "]");
    },

    'mouseup #canvas1': function(event){
      var x = event.offsetX;
      var y = event.offsetY;
      console.log("has soltado en: [" + x + "," + y + "]");
    }
  });
}