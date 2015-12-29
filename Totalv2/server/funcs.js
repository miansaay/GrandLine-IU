var destruir = function(partidaId,carta,nameObjetivo,objeto){
	var idObjetivo = Meteor.users.findOne({username: nameObjetivo})._id;
	var c = Caracteristicas.findOne({partidaId: partidaId,jugadorId: idObjetivo});

	if(!c[carta.Objeto[0]]){
		return false;
	}

	if(carta.Objeto[0] == "pico"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {pico: false}});
	} else if(carta.Objeto[0] == "vagoneta"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {vagoneta: false}});
	}else{
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {farolillo: false}});
	}

	return true;
};

var arreglar = function(partidaId,carta,nameObjetivo,objeto){
	var index = 0;
	if(carta.Objeto.length > 1){
		if(objeto != "default" && carta.Objeto.indexOf(objeto) == -1){
			return false;
		} else {
			index = carta.Objeto.indexOf(objeto);
		}
	}
	var idObjetivo = Meteor.users.findOne({username: nameObjetivo})._id;
	var c = Caracteristicas.findOne({partidaId: partidaId,jugadorId: idObjetivo});

	if(c[carta.Objeto[index]]){
		return false;
	}

	console.log(carta.Objeto[index]);
	if(carta.Objeto[index] == "pico"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {pico: true}});
	} else if(carta.Objeto[index] == "vagoneta"){
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {vagoneta: true}});
	}else{
		Caracteristicas.update({partidaId: partidaId,jugadorId: idObjetivo},{$set: {farolillo: true}});
	}

	return true;
};

var destapaCartaDestino = function(partidaId,row,col){
	var t = Partidas.findOne({_id: partidaId}).tablero;
	if (col != 11 || [12,14,16].indexOf(row) == -1){
		return false;
	}

	return t.list[row][col].carta;
};

var derrumbamiento = function(partidaId,row,col){
	var t = Partidas.findOne({_id: partidaId}).tablero;
	var coordenadas = row.toString() + "," + col.toString();
	if(!t.list[row][col].ocupada || ["14,3","12,11","14,11","16,11"].indexOf(coordenadas) != -1){
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
	Camino1: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: true, Abajo: true, Bloqueante: false},
	Camino2: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: true, Abajo: true, Bloqueante: false},
	Camino3: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: false},
	Camino4: { Type: "excavacion", Izquierda: false, Derecha: true, Arriba: false, Abajo: true, Bloqueante: false},
	Camino5: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: false, Abajo: true, Bloqueante: false},
	Camino6: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: true, Abajo: false, Bloqueante: false},
	Camino7: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: false, Abajo: false, Bloqueante: false},
	SinCamino1: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: false, Abajo: true, Bloqueante: true},
	SinCamino2: { Type: "excavacion", Izquierda: false, Derecha: true, Arriba: false, Abajo: true, Bloqueante: true},
	SinCamino5: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: false, Abajo: true, Bloqueante: true},
	SinCamino6: { Type: "excavacion", Izquierda: true, Derecha: false, Arriba: false, Abajo: false, Bloqueante: true},
	SinCamino7: { Type: "excavacion", Izquierda: false, Derecha: false, Arriba: true, Abajo: true, Bloqueante: true},
	SinCamino8: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: true, Abajo: false, Bloqueante: true},
	SinCamino9: { Type: "excavacion", Izquierda: true, Derecha: true, Arriba: false, Abajo: false, Bloqueante: true},
	//Tipo Inicio
	ComienzoEscalera: { Type: "camino", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: false},
	//Tipo Destino
	DestinoNada1: { Type: "camino", Izquierda: true, Derecha: false, Arriba: false, Abajo: true, Bloqueante: false},
	DestinoNada2: { Type: "camino", Izquierda: true, Derecha: false, Arriba: true, Abajo: false, Bloqueante: false},
	DestinoPepita: { Type: "camino", Izquierda: true, Derecha: true, Arriba: true, Abajo: true, Bloqueante: false},
	//Tipo Roll
	Saboteador: {Type: "roll", Roll: "Sabotear"},
	Buscador: {Type: "roll", Roll: "Buscar"},
	//Tipo Pepitas
	Pepitas1: {Type: "gold", nPepitas: 1},
	Pepitas2: {Type: "gold", nPepitas: 2},
	Pepitas3: {Type: "gold", nPepitas: 3},
	//Tipo Accion
	RomperVagoneta: {Type: "accionP", Funcion: destruir, Objeto: ["vagoneta"]},
	RomperFarolillo: {Type: "accionP", Funcion: destruir, Objeto: ["farolillo"]},
	RomperPico: {Type: "accionP", Funcion: destruir, Objeto: ["pico"]},
	ArreglarVagoneta: {Type: "accionP", Funcion: arreglar, Objeto:["vagoneta"]},
	ArreglarFarolillo: {Type: "accionP", Funcion: arreglar, Objeto:["farolillo"]},
	ArreglarPico: {Type: "accionP", Funcion: arreglar, Objeto:["pico"]},
	ArreglarFaro_Pico: {Type: "accionP", Funcion: arreglar, Objeto:["farolillo","pico"]},
	ArreglarFaro_Vagon: {Type: "accionP", Funcion: arreglar, Objeto: ["farolillo","vagoneta"]},
	ArreglarVagon_Pico: {Type: "accionP", Funcion: arreglar, Objeto: ["vagoneta","pico"]},
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
					'ArreglarFaro_Pico','ArreglarFaro_Vagon','ArreglarVagon_Pico','Derrumbamiento','Derrumbamiento',
					'Derrumbamiento'
];


ponerCamino = function(partidaId,jugadorId,carta,row,col){
	var t = Partidas.findOne({_id: partidaId}).tablero;
	var c = Caracteristicas.findOne({partidaId: partidaId, jugadorId: jugadorId});
	if(!c.farolillo || !c.pico || !c.vagoneta){
		return false;
	}
    if (t.posiblesCells.indexOf(row.toString() + "," + col.toString()) != -1 && !t.list[row][col].ocupada){
        return comprobarCelda(partidaId,t,carta,row,col);
    }

    return false;
};


var comprobarCelda = function(partidaId,tablero,carta,row,col){
	// Variables Importantes
	var c = tiposCartas[carta];
	// CHECKING

	if(c.Izquierda){
   		if(tablero.list[row][col-1].ocupada && !tablero.list[row][col-1].carta.Derecha){
   			return false;
   		}
   	}

	if(c.Derecha){
	   	if(tablero.list[row][col+1].ocupada && !tablero.list[row][col+1].carta.Izquierda){
	   		return false;
	   	}
	}

	if(c.Arriba){
	   	if(tablero.list[row-1][col].ocupada && !tablero.list[row-1][col].carta.Abajo){
	   		return false;
	   	}
   	}

	if(c.Abajo){
   		if(tablero.list[row+1][col].ocupada && !tablero.list[row+1][col].carta.Arriba){
   			return false;
   		}
   	}

   	// Si que se puede, actualizo Tablero y celdas posibles.
   	tablero.list[row][col].carta = c;
	tablero.list[row][col].nombre = carta;//Nuevooo IUUU
   	tablero.list[row][col].ocupada = true;

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

var crearMazo = function(array){
	var mazo = [];
	var aux = array.length;
	for (i = 0; i < aux; i++) {
		random = Math.floor(Math.random()*(array.length));
		mazo[i] = array[random];
		array.splice(random,1);
	};
	return mazo;
};


var prepararRolles = function(numJugadores){
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
	this.list[14][3].nombre = "ComienzoEscalera";//NUEVO IUU

   	this.list[12][11].carta = arrayDestinos[0];
   	this.list[12][11].ocupada = true;
	this.list[12][11].nombre = "CRevesDestino";//NUEVO IUU//NUEVO IUU

   	this.list[14][11].carta = arrayDestinos[1];
   	this.list[14][11].ocupada = true;
	this.list[14][11].nombre = "CRevesDestino";//NUEVO IUU//NUEVO IUU

   	this.list[16][11].carta = arrayDestinos[2];
   	this.list[16][11].ocupada = true;
	this.list[16][11].nombre = "CRevesDestino";//NUEVO IUU//NUEVO IUU
	
};


configurarPartida = function(partidaId){
	//Inicializar mov_card
	//Mov_card.insert({
	//	partida_id:partidaId,
	//	cartas:0
	//});
	
	
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
              puntuacion: 0,
    	});
	};

	//Crear Tablero
	var tablero = new Tablero();
	//Poner Ronda
	var ronda = 1;
	//Poner Turno
	var turno = Meteor.users.findOne({username: p.listaJugadores[0]})._id;

	Partidas.update({_id: partidaId}, {$set:{
						mazoGeneral: mazo,
						ronda: ronda,
						tablero: tablero,
						jugadorActivo: turno,
						empezada: true
					}});
};

RepartirPuntos = function(Buscadores,Saboteadores){
	NumeroJugadores = comprobarNum();
	var Puntos;
	if(Buscadores){
		Puntos = 4;
		for (i=0; i<NumeroJugadores; i++) {
			Roll = Caracteristicas.findOne({turno: i}).Roll;
			if (Roll === "Buscador"){
				Puntuacion = Caracteristicas.findOne({turno: i}).Puntuacion;
				Puntos = Puntuacion + Puntos;
				Caracteristicas.update({turno: i},{$set: {Puntuacion: Puntos}});
			}
		}
	}
	if(Saboteadores){
		//Como sé el número de jugadores,mirando la función PrepararRoles se puede saber el numero de sabotadores que hay.
		if((NumeroJugadores === 3) || (NumeroJugadores === 4)){ //Para 1 saboteador
			Puntos = 4;
		}
		if ((NumeroJugadores >= 5) && (NumeroJugadores <= 9)) { //Para 2 o 3 saboteadores.
			Puntos = 3;
		}
		if (NumeroJugadores === 10) { // Para 4 saboteadores
			Puntos = 2;
		}
		for (i=0; i<NumeroJugadores; i++) {
			Roll = Caracteristicas.findOne({turno: i}).Roll;
			if (Roll === "Saboteador"){
			    Puntuacion = Caracteristicas.findOne({turno: i}).Puntuacion;
				Puntos = Puntuacion + Puntos;
				Caracteristicas.update({turno: i},{$set: {Puntuacion: Puntos}});
			}
		}
	}

};

ComprobarPuntuacion = function(){
	NumeroJugadores = comprobarNum();
	Puntos = 0;
	for (i=0; i<NumeroJugadores; i++) {

		Puntuacion = Caracteristicas.findOne({turno: i}).Puntuacion;
		if(Puntuacion > Puntos){
			Puntos = Puntuacion;
		}
	}
	idenJugador = Caracteristicas.findOne({Puntuacion: Puntos}).JugadorId;
	nombreGanador = Jugadores.findOne({_id: idenJugador}).name;

	return nombreGanador;
};
