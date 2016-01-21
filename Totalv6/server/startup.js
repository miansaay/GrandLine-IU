var comprobarCredenciales = function(partidaId,jugadorId,carta){
    var p = Partidas.findOne({_id: partidaId});
    var c = Caracteristicas.findOne({partidaId: partidaId, jugadorId: jugadorId});
    var j = Meteor.users.findOne({_id:jugadorId});

    if(p.listaJugadores.indexOf(j.username) == -1){
        return false;
    }

    if (p.jugadorActivo != j.username){
        return false;
    }

    if(carta != null && c.mano.indexOf(carta.sprite) == -1){
        return false;
    }

    return true;
};

var descartarCarta = function(partidaId,jugadorId,carta){
    mano = Caracteristicas.findOne({jugadorId: jugadorId, partidaId: partidaId}).mano;
    posicionCarta = mano.indexOf(carta.sprite);
    mano.splice(posicionCarta,1);
    Caracteristicas.update({jugadorId: jugadorId, partidaId: partidaId},{$set:{mano: mano}});
};

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
    var index = (p.listaJugadores.indexOf(p.jugadorActivo) + 1) % p.numJugadores;
    Partidas.update({_id: partidaId}, {$set:{jugadorActivo: p.listaJugadores[index]}});
};


var actualizarTablero = function(partidaId,fila,columna,girada){
    var tablero = Partidas.findOne({_id: partidaId}).tablero;
    var aux = tablero.list[fila][columna].carta;
    if(girada){
        aux = girarCarta(aux);
    }
    if(tablero.list[fila][columna].carta.name != "DestinoPepita"){
        aux.name = "Ocupada";
    }    
    aux.Type = tablero.list[fila][columna].carta.Type;

    tablero.list[fila][columna].carta = aux;
    tablero.list[fila][columna].ocupada = true;

    //ABAJO
    if(tablero.list[fila][columna].carta.Abajo && !tablero.list[fila+1][columna].ocupada){
        tablero.posiblesCells.push((fila+1).toString() + "," + columna.toString());
    }

    //ARRIBA
    if(tablero.list[fila][columna].carta.Arriba && !tablero.list[fila-1][columna].ocupada){
        tablero.posiblesCells.push((fila-1).toString() + "," + columna.toString());
    }

    //DERECHA
    if(tablero.list[fila][columna].carta.Derecha && !tablero.list[fila][columna+1].ocupada){
        tablero.posiblesCells.push(fila.toString() + "," + (columna+1).toString());
    }

    //IZQUIERDA
    if(tablero.list[fila][columna].carta.Izquierda && !tablero.list[fila][columna-1].ocupada){
        tablero.posiblesCells.push(fila.toString() + "," + (columna-1).toString());
    } 

    Partidas.update({_id: partidaId}, {$set: {tablero: tablero}});
};


var llegaDestino = function(partidaId, carta){
    var tablero = Partidas.findOne({_id: partidaId}).tablero;
    var propCarta = tiposCartas[carta.sprite];
    var c = {sprite: "", fila: -1, columna:-1,girada: false};
    var girada = false;

    if(propCarta.Arriba==true){
        if(cartasDestino.indexOf(tablero.list[carta.fila-1][carta.columna].carta.name)!= -1){
            c.sprite = tablero.list[carta.fila-1][carta.columna].carta.name;
            c.fila = carta.fila-1;
            c.columna =carta.columna;
            if(!tablero.list[carta.fila-1][carta.columna].carta.Abajo){
                c.girada = true;
                girada = true;
            }
            tablero.list[carta.fila-1][carta.columna].carta.ocupada = true;
            actualizarTablero(partidaId,carta.fila-1,carta.columna,girada);
            return c;
        }   
    }
    if(propCarta.Abajo==true){
        if(cartasDestino.indexOf(tablero.list[carta.fila+1][carta.columna].carta.name)!= -1){
            c.sprite = tablero.list[carta.fila+1][carta.columna].carta.name;
            c.fila = carta.fila+1;
            c.columna =carta.columna; 
            if(!tablero.list[carta.fila+1][carta.columna].carta.Arriba){
                c.girada = true;
                girada = true;
            }
            tablero.list[carta.fila+1][carta.columna].carta.ocupada = true;
            actualizarTablero(partidaId,carta.fila+1,carta.columna,girada);
            return c;
        } 
    }
    if(propCarta.Izquierda==true){
        if(cartasDestino.indexOf(tablero.list[carta.fila][carta.columna-1].carta.name)!= -1){
            c.sprite = tablero.list[carta.fila][carta.columna-1].carta.name;
            c.fila = carta.fila;
            c.columna =carta.columna-1;
            if(!tablero.list[carta.fila][carta.columna-1].carta.Derecha){
                c.girada = true;
                girada = true;
            }
            tablero.list[carta.fila][carta.columna-1].carta.ocupada = true;
            actualizarTablero(partidaId,carta.fila,carta.columna-1,girada);
            return c;
        } 
    }
    if(propCarta.Derecha==true){
        if(cartasDestino.indexOf(tablero.list[carta.fila][carta.columna+1].carta.name)!= -1){
            c.sprite = tablero.list[carta.fila][carta.columna+1].carta.name;
            c.fila = carta.fila;
            c.columna =carta.columna+1;
            if(!tablero.list[carta.fila][carta.columna+1].carta.Izquierda){
                c.girada = true;
                girada = true;
            }
            tablero.list[carta.fila][carta.columna+1].carta.ocupada = true;
            actualizarTablero(partidaId,carta.fila,carta.columna+1,girada);
            return c;
        } 
    }

    return null;
};

var ponerCarta = function(partidaId,jugadorId,carta,nameObjetivo){
    var r = false;
    var selectedCard = tiposCartas[carta.sprite];
    switch(selectedCard.Type) {
        case "excavacion":
            r = ponerCamino(partidaId,jugadorId,carta);
            break;
        case "accionT":
            r = selectedCard.Funcion(partidaId,carta);
            break;
        case "accionP":
            r = selectedCard.Funcion(partidaId,selectedCard,nameObjetivo);
            break;
    }



    //INSERTAR EN ACCIONES
    if(r == true ){
        var cartaDestino = llegaDestino(partidaId,carta);

        if(cartaDestino != null){
            Acciones.insert({
                partidaId: partidaId,
                tipo: "doble",
                primera: carta,
                segunda: cartaDestino,
                datetime: new Date().getTime(),
            });
        }else{
            Acciones.insert({
                partidaId: partidaId,
                tipo: selectedCard.Type,
                carta: carta,
                targetName: nameObjetivo,
                datetime: new Date().getTime(),
            });
        }
    }

    return r;
};


var repartirPuntos = function(partidaId,tipoGanador){
    var caracs = Caracteristicas.find({partidaId: partidaId}).fetch();
    for (i = 0; i < caracs.length; i++) {
        if(caracs[i].roll == tipoGanador){
            Caracteristicas.update({partidaId: partidaId, jugadorId:caracs[i].jugadorId},{$inc: {puntuacion: 3}});
        }
    };
};

var setGanadores = function(partidaId){
    var ganadores = [];
    var caracs = Caracteristicas.find({partidaId: partidaId},{sort: {puntuacion: -1}}).fetch();
    for (i = 0; i < caracs.length; i++) {
        var nameJugador = Meteor.users.findOne({_id: caracs[i].jugadorId}).username;
        ganadores.push(nameJugador);
        //INSERTO O ACTUALIZO EN TOP LIST
        var aux = Toplist.findOne({name: nameJugador});
        if(aux){
            Toplist.update({name: nameJugador},{$inc: {puntos: caracs[i].puntuacion}});
        }else{
            Toplist.insert({
                name: nameJugador,
                puntos: caracs[i].puntuacion,
            });
        }
    };

    return ganadores;
};

/*var isFinish = function(partida){
    var bool = false;
    var tipoGanador = null;
    var ganadores = [];

    if(partida.mazoGeneral.length == 40){
        bool = true;
        tipoGanador = "Buscador";
    }

    return [bool,tipoGanador];
};*/


var isFinish = function(partida){
    var terminada = false;
    var tipoGanador = null;
    var mano = [];
    var caracs = Caracteristicas.find({partidaId: partida._id}).fetch();
    this.list = partida.tablero.list;
    this.usadas = partida.cartasUsadas;

    if((partida.mazoGeneral.length == 0) && (this.usadas == 64)){
        terminada = true;
        tipoGanador = "Saboteador";
    }

    if(this.list[14][11].carta.name == "DestinoPepita"){
        if((this.list[14][10].ocupada == true) && (this.list[14][10].carta.Derecha == true)){
            terminada = true;
            tipoGanador = "Buscador";

        }
        else if((this.list[13][11].ocupada == true) && (this.list[13][11].carta.Abajo == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[14][12].ocupada == true) && (this.list[14][12].carta.Izquierda == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[15][11].ocupada == true) && (this.list[15][11].carta.Arriba == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
    }

    if(this.list[12][11].carta.name == "DestinoPepita"){
        if((this.list[12][10].ocupada == true) && (this.list[12][10].carta.Derecha == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[11][11].ocupada == true) && (this.list[11][11].carta.Abajo == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[12][12].ocupada == true) && (this.list[12][12].carta.Izquierda == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[13][11].ocupada == true) && (this.list[13][11].carta.Arriba == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
    }

    if(this.list[16][11].carta.name == "DestinoPepita"){
        if((this.list[16][10].ocupada == true) && (this.list[16][10].carta.Derecha == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[15][11].ocupada == true) && (this.list[15][11].carta.Abajo == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[16][12].ocupada == true) && (this.list[16][12].carta.Izquierda == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
        else if((this.list[17][11].ocupada == true) && (this.list[17][11].carta.Arriba == true)){
            terminada = true;
            tipoGanador = "Buscador";
        }
    }
    /*if(this.list[16][11].carta.name == "DestinoNada1"){
      if((this.list[16][10].ocupada == true) && (this.list[16][10].carta.Derecha == true)){
          //
      }
      else if((this.list[15][11].ocupada == true) && (this.list[15][11].carta.Abajo == true)){
          terminada = true;
          tipoGanador = "Buscador";
      }
      else if((this.list[16][12].ocupada == true) && (this.list[16][12].carta.Izquierda == true)){
          terminada = true;
          tipoGanador = "Buscador";
      }
      else if((this.list[17][11].ocupada == true) && (this.list[17][11].carta.Arriba == true)){
          terminada = true;
          tipoGanador = "Buscador";
      }
    }*/

    if(terminada){
        this.usadas = 0;
        Partidas.update({_id: partida._id},{$set:{cartasUsadas: usadas}});
    }

    return [terminada,tipoGanador];
};


//PARA FINALIZAR TENGO QUE ELIMINAR LAS ACCIONES Y AÑADIR LA DE "FINALRONDA"
var finalRonda = function(partidaId){
    var p = Partidas.findOne({_id: partidaId});
    var aux = isFinish(p);
    if(aux[0]){
        //PRIMERO HAGO UN REMOVE DE TODAS LAS ACCIONES
        Acciones.remove({partidaId: partidaId});
        //AÑADO LA ACCION DE FINALIZAR RONDA
        Acciones.insert({
            partidaId: partidaId,
            tipo: "finalRonda",
            tipoGanador: aux[1],
            datetime: new Date().getTime(),
        });

        //REPARTO LOS PUNTOS(AHORA MISMO SIEMPRE GANAN BUSCADORES)
        repartirPuntos(partidaId,aux[1]);
        //POR ULTIMO CONFIGURO LA PARTIDA PARA SIGUIENTE RONDA
        if(p.ronda == 3){
            var ganadores = setGanadores(partidaId);
            Acciones.insert({
                partidaId: partidaId,
                tipo: "finalPartida",
                ganadores: ganadores,
                tipoGanador: aux[1],
                datetime: new Date().getTime(),
            });
        }else{
            Meteor.setTimeout(function(){configurarPartida(partidaId);}, 1000);
        }
    }

};

Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("partidas", function () {
        return Partidas.find({},{fields:{mazoGeneral:0}});
    });

    Meteor.publish("acciones", function () {
        return Acciones.find();
    });

    Meteor.publish("caracteristicas", function () {
        return Caracteristicas.find({jugadorId: this.userId});
    });

    Meteor.publish("toplist", function () {
        return Toplist.find();
    });


    Meteor.methods({
        removeAll: function(){
            Partidas.remove({});
            Caracteristicas.remove({});
            Acciones.remove({});
            Toplist.remove({});
        },

        nuevaPartida: function(titulo,numJugadores){
            var username = Meteor.users.findOne({_id: Meteor.userId()}).username;
            if (!Partidas.findOne({titulo: titulo})) {
                Partidas.insert({
                  titulo: titulo,
                  numJugadores: numJugadores,
                  listaJugadores: [username],
                  empezada: false,
                  cartasUsadas: 0
                });
            }
        },

        unirsePartida: function(partidaId){
            var username = Meteor.users.findOne({_id: Meteor.userId()}).username;
            var p = Partidas.findOne({_id: partidaId});
            if (p.listaJugadores.length < p.numJugadores){
                Partidas.update({_id: partidaId}, {$push: {listaJugadores: username}});
            }
        },

        empezarPartida: function(partidaId){
            //Comienzo de Partida, Crear Mazo, Crear Tablero, Poner Turno y Propiedades de Jugadores
            configurarPartida(partidaId);
        },

        jugarCarta: function(partidaId,accion,carta,nameObjetivo){
            var jugadorId = Meteor.userId();
            var usadas = Partidas.findOne({_id: partidaId}).cartasUsadas;
            //Comprobamos credenciales: es el turno de JugadorId y tiene la carta en la Mano.
            if (!comprobarCredenciales(partidaId,jugadorId,carta)){
              return false;
            }

            var r = true;
            if(accion != "descartar"){
                r = ponerCarta(partidaId,jugadorId,carta,nameObjetivo);
            }


            if(r != false){
                descartarCarta(partidaId,jugadorId,carta);
                if(Partidas.findOne({_id: partidaId}).mazoGeneral.length > 0){
                    nuevaCarta = robarCarta(partidaId);
                    Caracteristicas.update({partidaId: partidaId,jugadorId: jugadorId},{$push: {mano: nuevaCarta}});
                }
                usadas++;
                Partidas.update({_id: partidaId},{$set:{cartasUsadas: usadas}});
                actualizarTurno(partidaId);
            }

            //COMPROBAR SI SE HA TERMINADO LA RONDA O PARTIDA
            finalRonda(partidaId);

            return r;
        },
    });
});
