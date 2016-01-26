Meteor.subscribe('partidas');
Meteor.subscribe('caracteristicas');
Meteor.subscribe('acciones');
Meteor.subscribe('toplist');


Template.saboteur_temp.helpers({
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
	},

	rankSelected: function (){
		if (Session.get("Selected") == "inicio") {
			return Session.get("Selected");
		} else if (Session.get("Selected") == "partidas") {
			return Session.get("Selected");
		} else if (Session.get("Selected") == "partidassin") {
			return Session.get("Selected");
		} else if (Session.get("Selected") == "lista_partidas") {
			return Session.get("Selected");
		} else if (Session.get("Selected") == "crear_partida") {
			return Session.get("Selected");
		}
  	},


		inicio: function (){
			if (Session.get("Selected") == "inicio") {
				return true;
			}
	},

		partidas: function (){
			if (Session.get("Selected") == "partidas") {
				return true;
			}
	},

		partidassin: function (){
			if (Session.get("Selected") == "partidassin") {
				return true;
			}
	},

		lista_partidas: function (){
			if (Session.get("Selected") == "lista_partidas") {
				return true;
			}
	},

		crear_partida: function (){
			if (Session.get("Selected") == "crear_partida") {
				return true;
			}
	},

});


Template.saboteur_temp.events({
	'submit #crear_partida': function(event) {
		event.preventDefault();

	    var titulo = $('[name=titulo]').val();
	    var numJugadores = $('[name=numJugadores]').val();
	    Meteor.call("nuevaPartida",titulo, numJugadores);
		  $.growlUI('¡Enhorabuena!', 'Has creado una nueva partida');  
			Session.set("Selected","partidas");
	    //$(".tabs li:first-child a").click();

	},
	'click #unirse-partida': function(event){
	    event.preventDefault();
	    Meteor.call("unirsePartida", this._id);
		Session.set("Selected","lista_partidas");
	},
	'click #empezar-partida': function(event){
	    event.preventDefault();
	    Meteor.call("empezarPartida", this._id);
		Session.set("Selected","lista_partidas");
	},

	'click #entrar-partida': function(event){
	    event.preventDefault();
	    loadCanvas(this._id);
	    Session.set("juego", this._id);
	    $("#chatt").show();//AKI LLAMAMOS AL CHAT
	    $("#chat_gral2").hide();
	},

    "click #inicio": function () {
			Session.set("Selected","inicio");
		},
    "click #partidas": function () {
			Session.set("Selected","partidas");
		},

    "click #partidassin": function () {
			Session.set("Selected","partidassin");
		},

     "click #lista_partidas": function () {
			Session.set("Selected","lista_partidas");
		},

	 "click #crear_partida": function () {
			Session.set("Selected","crear_partida");
		},
});

