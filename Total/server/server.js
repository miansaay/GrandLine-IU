var comprobarCredenciales = function(partidaId,jugadorId,carta){
    var p = Partidas.findOne({_id: partidaId});
    var c = Caracteristicas.findOne({partidaId: partidaId, jugadorId: jugadorId});

    if (p.jugadorActivo != jugadorId){
        return false;
    }

    if(carta != null && c.mano.indexOf(carta) == -1){
        return false;
    }

    return true;
};

var descartarCarta = function(jugadorId, partidaId, carta){
    mano = Caracteristicas.findOne({jugadorId: jugadorId, partidaId: partidaId}).mano;
    posicionCarta = mano.indexOf(carta);
    mano.splice(posicionCarta,1);
    Caracteristicas.update({jugadorId: jugadorId, partidaId: partidaId},{$set:{mano: mano}});
}

var robarCarta = function(partidaId){
    partida = Partidas.findOne({_id: partidaId});
    mazo = partida.mazoGeneral;
    carta = mazo[mazo.length -1];
    mazo.pop();
    Partidas.update({_id: partidaId},{$set:{mazoGeneral: mazo}});
    return carta;
};

var actualizarTurno = function(partidaId){
    var p = Partidas.findOne({_id: partidaId});
    jugadorId = p.jugadorActivo;
    var index = (p.listaJugadores.indexOf(Meteor.users.findOne({_id: jugadorId}).username) + 1) % p.numJugadores;
    var turno = Meteor.users.findOne({username: p.listaJugadores[index]})._id;
    Partidas.update({_id: partidaId}, {$set:{jugadorActivo: turno}});

}


Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("partidas", function () {
        return Partidas.find();
    });

    Meteor.publish("caracteristicas", function () {
        return Caracteristicas.find();
    });


    Meteor.methods({
        removeAll: function(){
            Partidas.remove({});
            Caracteristicas.remove({});
        },

        nuevaPartida: function(username,titulo,numJugadores){
            if (! Partidas.findOne({titulo: titulo})) {
                Partidas.insert({
                  titulo: titulo,
                  numJugadores: numJugadores,
                  listaJugadores: [username],
                  empezada: false
                });
                
            }
        },

        unirsePartida: function(partidaId,username){
            var p = Partidas.findOne({_id: partidaId});
            if (p.listaJugadores.length < p.numJugadores){
                Partidas.update({_id: partidaId}, {$push: {listaJugadores: username}});
            }
        },

        empezarPartida: function(partidaId){
            //Comienzo de Partida, Crear Mazo, Crear Tablero, Poner Turno y Propiedades de Jugadores
            
            configurarPartida(partidaId);
        },

        ponerCarta: function(partidaId,jugadorId,carta,row,col,nameObjetivo,objeto){
            //Comprobamos credenciales: es el turno de JugadorId y tiene la carta en la Mano.
            if (!comprobarCredenciales(partidaId,jugadorId,carta)){
              return false;
            }
            //
            var r;
            switch(tiposCartas[carta].Type) {
              case "excavacion":
                r = ponerCamino(partidaId,jugadorId,carta,row,col);
                break;
              case "accionT":
                r = tiposCartas[carta].Funcion(partidaId,row,col);
                break;
              case "accionP":
                r = tiposCartas[carta].Funcion(partidaId,tiposCartas[carta],nameObjetivo,objeto);
                break;
            }


            if(r != false){

                descartarCarta(jugadorId, partidaId,carta);
                nuevaCarta = robarCarta(partidaId);
                Caracteristicas.update({partidaId: partidaId,jugadorId: jugadorId},{$push: {mano: nuevaCarta}});
                actualizarTurno(partidaId);

            }

            return r;
        },

        pasarTurno: function(partidaId,jugadorId,carta){//!!!!!!!!!!!!!!CAMBIAR NOMBRE pasarTurno!!!!!!!!!!!!!!!!!!!!
            if (!comprobarCredenciales(partidaId,jugadorId,carta)){
              return false;
            }
            descartarCarta(jugadorId, partidaId,carta);
            nuevaCarta = robarCarta(partidaId);
            Caracteristicas.update({partidaId: partidaId,jugadorId: jugadorId},{$push: {mano: nuevaCarta}});
            actualizarTurno(partidaId);

            return true;
        },
    });
});
