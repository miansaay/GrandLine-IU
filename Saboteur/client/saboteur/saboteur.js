Meteor.subscribe('partidas');
Meteor.subscribe('caracteristicas');
Meteor.subscribe('acciones');
Meteor.subscribe('toplist')


Template.tab_board.helpers({
  match: function() {
    return Partidas.find({});
  },
  mymatch: function() {
    return Partidas.find({listaJugadores: Meteor.user().username,empezada: false}); 
  },
  mystartedMatch: function() {
    return Partidas.find({listaJugadores: Meteor.user().username,empezada: true}); 
  },
  startMatch: function() {
    if (this.listaJugadores[0] == Meteor.user().username && this.numJugadores == this.listaJugadores.length) {
      return true;
    }
    return false;
  },
  userInMatch: function() {
    if (this.listaJugadores.indexOf(Meteor.user().username) == -1 && this.empezada == false){
      return true;
    }
    return false;
  },
  measure: function() {
    return this.listaJugadores.length.toString() + "/" + this.numJugadores.toString();
  }
});


Template.tab_board.events({
  'submit #tab-new': function(event){
    event.preventDefault();

    var titulo = $('[name=titulo]').val();
    var numJugadores = $('[name=numJugadores]').val();
    
    Meteor.call("nuevaPartida",titulo, numJugadores);
    $(".tabs li:first-child a").click();
  },

  'click .unirse-partida': function(event){
    event.preventDefault();
    Meteor.call("unirsePartida", this._id);
  },

  'click .empezar-partida': function(event){
    event.preventDefault();
    Meteor.call("empezarPartida", this._id);
  },

  'click .entrar-partida': function(event){
    event.preventDefault();
    loadCanvas(this._id);
  }

});

