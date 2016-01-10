Meteor.subscribe("partidas");
Meteor.subscribe("caracteristicas");
Meteor.subscribe("mov_card");





$.validator.setDefaults({
  rules: {
    username: {required: true},
    password: {required: true, minlength: 6}
  },
  messages: {
      username: {
          required: "You must enter an username.",
      },
      password: {
        required: "You must enter a password.",
        minlength: "Your password must be at least {6} characters"
      }
  }
});


// TOTAL PARTIDAS
Template.totalPartidas.helpers({
    listTotal: function () {
      return Partidas.find();
    },

    auxTotal: function () {
      if (this.listaJugadores.indexOf(Meteor.user().username) == -1){
        return true;
      }
      return false;
    },
});

Template.totalPartidas.events({
  'submit form': function(event){
    event.preventDefault();

    var titulo = $('[name=titulo]').val();
    var numJugadores = $('[name=numJugadores]').val();

    Meteor.call("nuevaPartida", Meteor.user().username, titulo, numJugadores);
  },

  'click .unirsePartida': function(event){
    event.preventDefault();
    Meteor.call("unirsePartida", this._id, Meteor.user().username);
  },

});

// MIS PARTIDAS

Template.misPartidas.helpers({
    listMias: function (bool) {
      return Partidas.find({listaJugadores: Meteor.user().username, empezada: bool});
    },

    auxMias: function () {
      return this.listaJugadores[0] == Meteor.user().username && this.numJugadores == this.listaJugadores.length && !this.empezada
    },
    selectedPartida: function () {
      var partidaId = this._id;
      var selectedPartida = Session.get("selectedPartida");
      if(partidaId == selectedPartida){
        return "selected"
      }
    },

});


Template.misPartidas.events({
  'click .empezarPartida': function(event){
    event.preventDefault();
    Meteor.call("empezarPartida", this._id);
    //render();
  },

  'click .miPartida': function(){
    if(Partidas.findOne({_id: this._id}).empezada){
      Session.set("selectedPartida",this._id);
      render();
    }
  },

});

// PARTIDA SELECCIONADA
rendThis = function() {
  if(Partidas.find().count() > 0 && Session.get("selectedPartida")){
    return true;
  }
  return false;
}

myTurno = function(){
  var turno = Partidas.findOne({_id: Session.get("selectedPartida")}).jugadorActivo;
  if(turno == Meteor.userId()){
    return true;
  }
  return false;

}
partd = function(){
  return Partidas.findOne({_id: Session.get("selectedPartida")});
}

mazLength = function(){
  return Partidas.findOne({_id: Session.get("selectedPartida")}).mazoGeneral.length;
}

caracteristicas = function(){
    return Caracteristicas.findOne({partidaId: Session.get("selectedPartida"),jugadorId: Meteor.userId()});
}

Template.actualPartida.helpers({
    /*renderThis: function () {
      if(Partidas.find().count() > 0 && Session.get("selectedPartida")){
        return true;
      }
      return false;
    },*/
    renderThis: function() {
      return rendThis();
    },

    /*miTurno: function () {
      var turno = Partidas.findOne({_id: Session.get("selectedPartida")}).jugadorActivo;
      if(turno == Meteor.userId()){
        return true;
      }
      return false;
    },*/
    miTurno: function(){
        return myTurno();
    },

    /*partida: function () {
      return Partidas.findOne({_id: Session.get("selectedPartida")});
    },*/
    partida: function(){
        return partd();
    },

    /*mazoLength: function () {
      return Partidas.findOne({_id: Session.get("selectedPartida")}).mazoGeneral.length;
    },*/
    mazoLength: function(){
        return mazLength();
    },

    /*carac: function () {
      return Caracteristicas.findOne({partidaId: Session.get("selectedPartida"),jugadorId: Meteor.userId()});
    },*/
    carac: function(){
      return caracteristicas();
    },
});

Template.actualPartida.events({
  'submit form': function(event){
    event.preventDefault();
    var partidaId = Session.get("selectedPartida");
    var carta = $('#Mano option:selected').val();
    var tipo = $('#Tipo option:selected').val();
    var objetivo = $('#Objetivo option:selected').val();
    var objeto = $('#Objeto option:selected').val();
    var fila = $('[name=fila]').val();
    var columna = $('[name=columna]').val();

    if(tipo == "Poner"){
      Meteor.call("ponerCarta", partidaId, Meteor.userId(),carta,parseInt(fila),parseInt(columna),objetivo,objeto);
    }else{
      Meteor.call("pasarTurno", partidaId, Meteor.userId(),carta);
    }

  },
});




// REGISTRATION

Template.register.events({
  'submit form': function(event){
    event.preventDefault();
  }
});

Template.register.onRendered(function(){
  var validator = $('.register').validate({
    submitHandler: function(){
      var username = $('[name=username]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
          username: username,
          password: password,
        }, function(error){
          if(error){
            if(error.reason == "Username already exists."){
              validator.showErrors({
                  username: "That username already belongs to a registered user."
              });
            }
          }else{
            Router.go("home");
          }
      });
    }
  });
});



Template.navigation.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    Router.go("home");
  }
});

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
  }
});

Template.login.onRendered(function(){
  var validator = $('.login').validate({
    submitHandler: function(event){
      var username = $('[name=username]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(username, password, function(error){
          if(error){
            if(error.reason == "User not found"){
                validator.showErrors({
                    username: "That username doesn't belong to a registered user."
                });
            }
            if(error.reason == "Incorrect password"){
                validator.showErrors({
                    password: "You entered an incorrect password."
                });
            }
          }else{
              Router.go("home");
          }
      });
    }
  });
});
