Meteor.subscribe('partidas');
Meteor.subscribe('caracteristicas');
Meteor.subscribe('acciones');
Meteor.subscribe('toplist')


$.validator.setDefaults({
  rules: {
    username: {required: true},
    email: {required: true, email: true},
    password: {required: true, minlength: 6}
  },
  messages: {
      username: {
          required: "You must enter an username.",
      },
      email: {
          required: "You must enter an email address.",
          email: "You have entered an invalid email address."
      },
      password: {
        required: "You must enter a password.",
        minlength: "Your password must be at least {6} characters"
      }
  }
});

Template.list_top.helpers({
  top: function() {
    return Toplist.find({},{sort: {puntos: -1}, limit: 5}).map(function (doc, index, cursor){
      return _.extend(doc, {index: index + 1});
    });
  },
  
});



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


Template.register.events({
  'submit form': function(event){
    event.preventDefault();
  }
});

Template.register.onRendered(function(){
  var validator = $('.register').validate({
    submitHandler: function(){
      var username = $('[name=username]').val();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
          username: username,
          email: email,
          password: password,
        }, function(error){
          if(error){
            if(error.reason == "Username already exists."){
              validator.showErrors({
                  username: "That username already belongs to a registered user."   
              });
            }
            if(error.reason == "Email already exists."){
              validator.showErrors({
                  email: "That email already belongs to a registered user."   
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
    $(".tab-board .tabs li:first-child a").click();
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
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error){
          if(error){
            if(error.reason == "User not found"){
                validator.showErrors({
                    email: "That email doesn't belong to a registered user."   
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


