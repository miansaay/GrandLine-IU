var destruir = function(partidaId,carta,nameObjetivo){
	var idObjetivo = Meteor.users.findOne({username: nameObjetivo})._id;
	var c = Caracteristicas.findOne({partidaId: partidaId,jugadorId: idObjetivo});

	if(!c[carta.Objeto]){
		return false;
	}

	if(carta.Objeto == "pico"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {pico: false}});
	} else if(carta.Objeto == "vagoneta"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {vagoneta: false}});
	}else{
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {farolillo: false}});
	}

	return true;
};

var arreglar = function(partidaId,carta,nameObjetivo){
	var idObjetivo = Meteor.users.findOne({username: nameObjetivo})._id;
	var c = Caracteristicas.findOne({partidaId: partidaId,jugadorId: idObjetivo});

	if(c[carta.Objeto]){
		return false;
	}

	if(carta.Objeto == "pico"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {pico: true}});
	}else if(carta.Objeto == "vagoneta"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {vagoneta: true}});
	}else{
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {farolillo: true}});
	}

	return true;
};

var destapaCartaDestino = function(partidaId,carta){
	var row = carta.fila;
	var col = carta.columna;
	var t = Partidas.findOne({_id: partidaId}).tablero;

	if (col != 11 || [12,14,16].indexOf(row) == -1){
		return false;
	}

	return t.list[row][col].carta;
};

var derrumbamiento = function(partidaId,carta){
	var row = carta.fila;
	var col = carta.columna;
	var t = Partidas.findOne({_id: partidaId}).tablero;

	var coordenadas = row.toString() + "," + col.toString();
	if( ["14,3","12,11","14,11","16,11"].indexOf(coordenadas) != -1 || !t.list[row][col].ocupada ){
		return false;
	}

	t.posiblesCells.push(coordenadas);
	t.list[row][col].carta = tiposCartas.Standard;
	t.list[row][col].ocupada = false;
	Partidas.update({_id: partidaId}, {$set: {tablero: t}});
	return true;
};


tiposCartas = {
	Standard: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: false, Abajo: false, Bloqueante: false},
	//Tipo tunel
	Camino1: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: false},
	Camino2: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: false, Abajo: false, Bloqueante: false},
	Camino3: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: false, Abajo: true, Bloqueante: false},
	Camino4: { Type: "excavacion", Izquierda: false, Derecha: true, Arriba: false, Abajo: true, Bloqueante: false},
	Camino5: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: false, Abajo: true, Bloqueante: false},
	Camino6: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: true, Abajo: true, Bloqueante: false},
	Camino7: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: true, Abajo: true, Bloqueante: false},
	SinCamino1: { Type: "excavacion", Izquierda: false, Derecha: true, Arriba: false, Abajo: true, Bloqueante: true},
	SinCamino2: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: false, Abajo: true, Bloqueante: true},
	SinCamino3: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: true, Abajo: true, Bloqueante: true},
	SinCamino4: { Type: "excavacion", Izquierda: false, Derecha: true, Arriba: false, Abajo: false, Bloqueante: true},
	SinCamino5: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: true, Abajo: false, Bloqueante: true},
	SinCamino6: { Type: "excavacion", Izquierda: false, Derecha: true, Arriba: true, Abajo: true, Bloqueante: true},
	SinCamino7: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: true},
	SinCamino8: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: false, Abajo: false, Bloqueante: true},
	SinCamino9: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: true, Abajo: false, Bloqueante: true},
	//Tipo Inicio
	ComienzoEscalera: { Type: "camino", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: false},
	//Tipo Destino
	DestinoNada1: { Type: "camino", Izquierda: false, Derecha: true, Arriba: false, Abajo: true, Bloqueante: false,name: "DestinoNada1"},
	DestinoNada2: { Type: "camino", Izquierda: true, Derecha: false, Arriba: false, Abajo: true, Bloqueante: false,name: "DestinoNada2"},
	DestinoPepita: { Type: "camino", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: false,name: "DestinoPepita"},
	//Tipo Roll
	Saboteador: {Type: "roll", Roll: "Sabotear"},
	Buscador: {Type: "roll", Roll: "Buscar"},
	//Tipo Pepitas
	Pepitas1: {Type: "gold", nPepitas: 1},
	Pepitas2: {Type: "gold", nPepitas: 2},
	Pepitas3: {Type: "gold", nPepitas: 3},
	//Tipo Accion
	RomperVagoneta: {Type: "accionP", Funcion: destruir, Objeto: "vagoneta"},
	RomperFarolillo: {Type: "accionP", Funcion: destruir, Objeto: "farolillo"},
	RomperPico: {Type: "accionP", Funcion: destruir, Objeto: "pico"},
	ArreglarVagoneta: {Type: "accionP", Funcion: arreglar, Objeto:"vagoneta"},
	ArreglarFarolillo: {Type: "accionP", Funcion: arreglar, Objeto:"farolillo"},
	ArreglarPico: {Type: "accionP", Funcion: arreglar, Objeto:"pico"},
	Mapa: {Type: "accionT", Funcion: destapaCartaDestino},
	Derrumbamiento: {Type: "accionT", Funcion: derrumbamiento}
};


cartasExcavacion = ['Camino1','Camino1','Camino1','Camino1','Camino2','Camino2','Camino2','Camino2','Camino2','Camino3',
				   		'Camino3','Camino3','Camino3','Camino3','Camino4','Camino4','Camino4','Camino4','Camino5','Camino5',
				   		'Camino5','Camino5','Camino5','Camino6','Camino6','Camino6','Camino6','Camino6','Camino7','Camino7',
				   		'Camino7','SinCamino1','SinCamino2','SinCamino3','SinCamino4','SinCamino5','SinCamino6',
				   		'SinCamino7','SinCamino8','SinCamino9'
];

cartaInicio = ['ComienzoEscalera'];

cartasDestino = ['DestinoNada1','DestinoNada2','DestinoPepita'];

cartasPepitas = ['Pepitas1','Pepitas1','Pepitas1','Pepitas1','Pepitas1','Pepitas1','Pepitas1','Pepitas1','Pepitas1',
					 'Pepitas1','Pepitas2','Pepitas2','Pepitas2','Pepitas2','Pepitas2','Pepitas2','Pepitas2','Pepitas2',
					 'Pepitas2','Pepitas3','Pepitas3','Pepitas3','Pepitas3','Pepitas3','Pepitas3','Pepitas3','Pepitas3',
					 'Pepitas3'
];

cartasAccion = ['Mapa','Mapa','Mapa','Mapa','Mapa','Mapa','ArreglarVagoneta','ArreglarVagoneta','ArreglarPico',
					'ArreglarPico','ArreglarFarolillo','ArreglarFarolillo','RomperVagoneta','RomperVagoneta','RomperVagoneta',
					'RomperFarolillo','RomperFarolillo','RomperFarolillo','RomperPico','RomperPico','RomperPico',
					'Derrumbamiento','Derrumbamiento','Derrumbamiento'
];


girarCarta = function(carta){
	aux = tiposCartas.Standard;
	aux.Abajo = carta.Arriba;
	aux.Arriba = carta.Abajo;
	aux.Izquierda = carta.Derecha;
	aux.Derecha = carta.Izquierda;
	aux.Bloqueante = carta.Bloqueante;

	return aux;
};


ponerCamino = function(partidaId,jugadorId,carta){
	var tipoCarta = tiposCartas[carta.sprite];
	var t = Partidas.findOne({_id: partidaId}).tablero;
	var c = Caracteristicas.findOne({partidaId: partidaId, jugadorId: jugadorId});
	if(!c.farolillo || !c.pico || !c.vagoneta){
		return false;
	}
    if (t.posiblesCells.indexOf(carta.fila.toString() + "," + carta.columna.toString()) != -1 && !t.list[carta.fila][carta.columna].ocupada){
				if(carta.girada){
					tipoCarta = girarCarta(tipoCarta);
				}
        return comprobarCelda(partidaId,t,tipoCarta,carta.fila,carta.columna);

    }

    return false;
};


var comprobarCelda = function(partidaId,tablero,c,row,col){
	// [izq,der,arr,abj]
	var aux = [null,null,null,null];
	var caux = [c.Derecha,c.Izquierda,c.Arriba,c.Abajo];

	// CHECKING

   	if(tablero.list[row][col+1].ocupada){
   		if(tablero.list[row][col+1].carta.Izquierda){
   			aux[0] = true;
   		}else{
   			aux[0] = false;
   		}
   	}
///
   	if(tablero.list[row][col-1].ocupada){
   		if(tablero.list[row][col-1].carta.Derecha){
   			aux[1] = true;
   		}else{
   			aux[1] = false;
   		}
   	}

  	if(tablero.list[row-1][col].ocupada){
   		if(tablero.list[row-1][col].carta.Abajo){
   			aux[2] = true;
   		}else{
   			aux[2] = false;
   		}
   	}


   	if(tablero.list[row+1][col].ocupada){
   		if(tablero.list[row+1][col].carta.Arriba){
   			aux[3] = true;
   		}else{
   			aux[3] = false;
   		}
   	}

   	// Comprobar con aux
   	for (i = 0; i < 4; i++) {
   		if(aux[i] != null && aux[i] != caux[i]){
   			return false;
   		}
   	};

   	// Si que se puede, actualizo Tablero y celdas posibles.
   	tablero.list[row][col].carta = c;
   	tablero.list[row][col].ocupada = true;

   	if(!c.Bloqueante){
	   	if(c.Izquierda && !tablero.list[row][col-1].ocupada){
			tablero.posiblesCells.push(row.toString() + "," + (col-1).toString());
		}
		if (c.Derecha && !tablero.list[row][col+1].ocupada) {
			tablero.posiblesCells.push(row.toString() + "," + (col+1).toString());
		}
		if (c.Arriba && !tablero.list[row-1][col].ocupada) {
			tablero.posiblesCells.push((row-1).toString() + "," + col.toString());
		}
		if (c.Abajo && !tablero.list[row+1][col].ocupada) {
			tablero.posiblesCells.push((row+1).toString() + "," + col.toString());
		}
	}


   	Partidas.update({_id: partidaId}, {$set: {tablero: tablero}});

   	return true;
};



var nMaxCartas = function(numJugadores){
	var n;
	if ((numJugadores >= 2) && (numJugadores <= 5)) {
		n = 7;
	}
	if ((numJugadores === 6) || (numJugadores === 7)) {
		n = 6;
	}
	if ((numJugadores >= 8) && (numJugadores <= 10)) {
		n = 4;
	}
	return n;
};

var crearMazo = function(data){
	var mazo = [];
	var array = data.slice();
	var aux = array.length;
	for (i = 0; i < aux; i++) {
		random = Math.floor(Math.random()*(array.length));
		mazo[i] = array[random];
		array.splice(random,1);
	};
	return mazo;
};


var prepararRolles = function(numJugadores){
	if(numJugadores == 2){
		return ["Buscador","Saboteador"];
	}
	var numSaboteadores = Math.round(numJugadores/2)-1;
	var numBuscadores = numJugadores - numSaboteadores;

	var Sabos = Array.apply(null,Array(numSaboteadores)).map(function() {return "Saboteador"});
	var Bus = Array.apply(null,Array(numBuscadores)).map(function() {return "Buscador"});

	return Sabos.concat(Bus);
};

var convertDestinos = function(array){
	var x = [];

	for (i = 0; i < 3; i++) {
		if (array[i] == 'DestinoNada1'){
   			x.push(tiposCartas.DestinoNada1);
		} else if(array[i] == 'DestinoNada2'){
			x.push(tiposCartas.DestinoNada2);
		} else {
			x.push(tiposCartas.DestinoPepita);
		}
	};

	return x;
};

var Celda = function(){
	this.carta = tiposCartas.Standard;
	this.ocupada = false;
};

var Tablero = function(){
	this.list = new Array(31);
	this.posiblesCells = [];

	for (i = 0; i < 31; i++) {
		this.list[i] = new Array(15);
  		for (j = 0; j < 15; j++) {
	  		this.list[i][j] = new Celda();
	  	};
   	};

   	this.posiblesCells.push("14,2","14,4","13,3","15,3");

   	var arrayDestinos = convertDestinos(crearMazo(cartasDestino));

   	this.list[14][3].carta = tiposCartas.ComienzoEscalera;
   	this.list[14][3].ocupada = true;

   	this.list[12][11].carta = arrayDestinos[0];
   	this.list[12][11].ocupada = false;

   	this.list[14][11].carta = arrayDestinos[1];
   	this.list[14][11].ocupada = false;

   	this.list[16][11].carta = arrayDestinos[2];
   	this.list[16][11].ocupada = false;
};


configurarPartida = function(partidaId){
	//PRIMERO QUITA TODAS LAS ACCIONES DE POSIBLES RONDAS ANTERIORES
	Acciones.remove({partidaId: partidaId});
	//Variables Importantes
	var p = Partidas.findOne({_id: partidaId});
	var numJugadores = p.listaJugadores.length;
	var mano = new Array(numJugadores);

	//Crear Mazo Rolles: Array de Rolles
	var rolls = crearMazo(prepararRolles(numJugadores));

	//Crear Mazo Principal y La Mano de los Jugadores
	var mazo = crearMazo(cartasExcavacion.concat(cartasAccion));
	var n = nMaxCartas(numJugadores);
	for (i = 0; i < numJugadores; i++) {
		mano[i] = new Array(n);
		for (j = 0; j < n; j++) {
			mano[i][j] = mazo[mazo.length-1];
			mazo.splice(mazo.length-1,1);
		};
	};

	//Crear Tablero
	var tablero = new Tablero();
	//Poner Ronda
	var ronda;
	var puntuacion = [];
	if(p.ronda){
		ronda = p.ronda + 1;
		var caracs = Caracteristicas.find({partidaId: partidaId}).fetch();
	    for (i = 0; i < caracs.length; i++) {
	    	puntuacion[i] = caracs[i].puntuacion;
	    };
		Caracteristicas.remove({partidaId: partidaId});
	}else{
		ronda = 1;
		for (i = 0; i < numJugadores; i++) {
			puntuacion[i] = 0;
		};
	}

	//Crear Caracteristicas de Jugadores
	for (i = 0; i < numJugadores; i++) {
		Caracteristicas.insert({
	        partidaId: partidaId,
	        jugadorId: Meteor.users.findOne({username: p.listaJugadores[i]})._id,
	        mano: mano[i],
	        farolillo: true,
	        pico: true,
	        vagoneta: true,
	        roll: rolls[i],
	        puntuacion: puntuacion[i],
	   	});
	};


	Partidas.update({_id: partidaId}, {$set:{
						mazoGeneral: mazo,
						ronda: ronda,
						tablero: tablero,
						jugadorActivo: p.listaJugadores[0],
						empezada: true,
						cartasUsadas: 0,
					}});
};
