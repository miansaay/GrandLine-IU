Meteor.subscribe('ranking');
Meteor.subscribe('toplist');
Meteor.subscribe('perfiles');



  	Template.ranking.events({

    "click #Boton_global": function () {
			Session.set("rankSelected","Global");
		},

    "click #Boton_allien": function () {
			Session.set("rankSelected", "Allien");
		},

    "click #Boton_saboteur": function () {
			Session.set("rankSelected", "Saboteur");
		}
  	});

	Template.ranking.helpers({ 
		rankSelected: function (){
			if (Session.get("rankSelected") == "Allien") {
				return Session.get("rankSelected");
			} else if (Session.get("rankSelected") == "Saboteur") {
				return Session.get("rankSelected");
			} else {
				return Session.get("rankSelected");
			} 
	},

		allien: function (){
			if (Session.get("rankSelected") == "Allien") {
				return true;
			}
	},

		saboteur: function (){
			if (Session.get("rankSelected") == "Saboteur") {
				return true;
			}
	},
	
		global: function (){
			if (Session.get("rankSelected") == "Global") {
				return true;
			}
	},

	});

	Template.tablaespecif.helpers({
	  "position": function() {
			if (Session.get("rankSelected") == "Allien") {
			return Ranking.find({juego: "Allien"}, {sort : {puntos : -1}, limit : 10}).map(function(document, index){
           document.index = index +1;
			return document;
			});
		} else if (Session.get("rankSelected") == "Saboteur") {
			return Ranking.find({juego: "Saboteur"}, {sort : {puntos : -1}, limit : 10}).map(function(document, index){
           document.index = index +1;
			return document;
			});
		} 
		},



	"jugadorSelected": function() {
			var playerID = this.user_id;
			return Perfiles.findOne({_id: playerID });
	  },
		nombrejuego: function() {
					 return Session.get("rankSelected");
	  }
	});


	Template.tablaglobal.helpers({
	  "position2": function() {

				return Ranking.find({}, {sort : {puntos : -1}, limit : 10}).map(function(document, index){
           document.index = index +1;
			return document;});
	  },

	"jugadorSelected2": function() {
			var playerID = this.user_id;
			return Perfiles.findOne({_id: playerID });
	  }
	});



