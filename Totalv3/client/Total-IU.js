

render = function() {

  //Diccionario de cartas
    var TiposCartas = {
      Camino1 : [4,1],
      Camino2 : [5,1], //5,1 inversa,Tenemos que buscar como rotar la carta
      Camino3 : [9,0],
      Camino4 : [2,1],
      Camino5 : [3,1],
      Camino6 : [2,1], //2,1 inversa
      Camino7 : [0,1],
      SinCamino1 : [4,0],//rotar
      SinCamino2 : [5,0],//rotar
      SinCamino3 : [0,0],//no es la que corresponde
      SinCamino4 : [0,0],
      SinCamino5 : [1,0],
      SinCamino6 : [4,0],//rotar
      SinCamino7 : [2,0],
      SinCamino8 : [8,0],
      SinCamino9 : [7,0],
      ComienzoEscalera : [0,3],
      DestinoNada1 : [3,3],
      DestinoNada2 : [2,3],
      DestinoPepita : [1,3],
      Saboteador : [0,5], //definir m�s adelante en funci�n de los colores
      Minero : [0,4],//definir tambi�n en funci�n de colores
      Pepitas1 : [7,2],
      Pepitas2 : [8,2],
      Pepitas3 : [9,2],
      RomperPico : [4,2],
      RomperVagoneta :[6,2],
      RomperFarolillo : [5,2],
      ArreglarVagoneta : [7,1],
      ArreglarPico : [8,1],
      ArreglarFarolillo : [9,1],
      ArreglarFaro_Vagon : [0,2],
      ArreglarFaro_Pico : [1,2],
      ArreglarVagon_Pico : [2,2],
      Mapa : [6,1],
      Derrumbamiento : [1,3],
      CRevesCamino : [4,3],
      CRevesDestino : [5,3],
      CRevesPepita : [7,3],
      CRevesPersonaje : [6,3],
    }

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var canvas1 = document.getElementById('canvas1');
    var ctx1 = canvas.getContext('2d');

    var distanciax;
    var distanciay;
    var ult_pos;
    var pos_ini;

    var tablero= new Image();
    //tablero.src='https://image.freepik.com/foto-gratis/plank--de-madera--textura--madera_318727.jpg'
    tablero.src='tablero.jpg'

    var sprite = new Image();
    sprite.src = 'sprites.png'

    var wcard=90
    var hcard=110
    var widht=60;
    var height=90;
    var can_widht=$('#canvas').attr('width');
    var can_height= $('#canvas').attr('height');

    //Canvas para las puntuaciones
    /*var canvas2 = document.getElementById('canvas2');
    var ctx2 = canvas2.getContext('2d');
    var tablero2= new Image();
    tablero2.src='tablero.jpg'
    var can_widht2=$('#canvas2').attr('width');
    var can_height2= $('#canvas2').attr('height');*/



    var cartas_mano=[]
    
    function card(x,y,sx,sy,nombre) {
          this.x = x*widht;
          this.y = y*height;
          this.sx=sx;
          this.sy=sy;
	  this.nombre=nombre;
          this.selec=false;
      }

    card.prototype.draw = function (img,ctx) {
	
        return ctx.drawImage(img,this.sx*wcard,this.sy*hcard,wcard,hcard,this.x,this.y,widht,height);
    };


    

    function clear() {
        ctx.clearRect(0,0,can_widht,can_height);
        
    }

    function draw() {
	
	rend_tablero() 
	
        for (var i = 0; i < cartas_mano.length; i++) {
            cartas_mano[i].draw(sprite,ctx);
        }
	
        //window.requestAnimationFrame(draw);
    }
    
    
    function rend_tablero() {
      
      ctx.clearRect(0,850,can_widht,can_height);
      
      ctx.drawImage(tablero,0,0,can_widht,can_height);
      
      ctx.drawImage(sprite,4*wcard,5*hcard,wcard,hcard,11*widht,8*height,widht,height)
        
      tablero_db=Partidas.findOne({_id: Session.get("selectedPartida")}).tablero.list;
      
      Posibles_cell=Partidas.findOne({_id: Session.get("selectedPartida")}).tablero.posiblesCells;
      
      //console.log(Posibles_cell)
    
      for (var i = 0; i < Posibles_cell.length; i++) {
	  cell=Posibles_cell[i].split(",")
	  fila=cell[1]*widht
	  col=(cell[0]-11)*height
	  
	  if (tablero_db[cell[0]][cell[1]].ocupada==false){
	    //ctx.moveTo(fila,col);
	    //ctx.lineTo((fila+widht),(col));
	    //ctx.strokeStyle = "#f00";
	    //ctx.stroke();
	    
	    //ctx.moveTo((fila+widht),(col));
	    //ctx.lineTo(fila+widht,(col+height));
	    //ctx.strokeStyle = "#f00";
	    //ctx.stroke();
	    
	    //ctx.moveTo(fila,(col+height));
	    //ctx.lineTo(fila+widht,(col+height));
	    //ctx.strokeStyle = "#f00";
	    //ctx.stroke();
	    
	    //ctx.moveTo((fila),(col+height));
	    //ctx.lineTo(fila,col);
	    //ctx.strokeStyle = "#f00";
	    //ctx.stroke();
	    
	    //ctx.moveTo(fila+20,col+20);
	    //ctx.lineTo((fila+widht)-20,(col+height)-20);
	    //ctx.strokeStyle = "#f00";
	    //ctx.stroke();
	    
	    //ctx.moveTo(fila-20+widht,col+20);
	    //ctx.lineTo(fila+20,(col+height)-20);
	    //ctx.strokeStyle = "#f00";
	    //ctx.stroke();
	    
	    ctx.drawImage(sprite,4*wcard,3*hcard,wcard,hcard,fila,col,widht,height)
	    
	    
	  }	  
      }
    
    
      //for (var i = 0; i < tablero_db.length; i++) {
      for (var i = 11; i < 18; i++) {
	fila=tablero_db[i]
	for (var j = 0; j < (fila.length); j++) {
	  pos=fila[j]
	  if (pos.ocupada){
	    
	    nombre=pos.nombre
	    
	    //console.log(i)
	    //console.log(j)
	    //console.log(nombre)
	    
	    //if (nombre=="camino") {
	    //  nombre="ComienzoEscalera"
	    //}else{nombre="ComienzoEscalera"}
	    
	   
  
	    ctx.drawImage(sprite,TiposCartas[nombre][0]*wcard,TiposCartas[nombre][1]*hcard,wcard,hcard,j*widht,(i-11)*height,widht,height);
	  }
	}
      }
        
    }
    
    function rend_Carac() {
        
	//ctx2.drawImage(tablero,0,0,can_widht2,can_height2);
	
	//Título
        if (rendThis()){
          if(myTurno()){
            ctx.fillStyle = "rgb(30, 144, 255)";
    	      ctx.font = "bold 27px  Fantasía";
    	      ctx.textAlign = "left";
    	      ctx.textBaseline = "top";
            ctx.fillText("Título: " + partd().titulo + ": (ES MI TURNO)", 850, 10);
          } else  {
            ctx.fillStyle = "rgb(30, 144, 255)";
    	      ctx.font = "bold 27px  Fantasía";
    	      ctx.textAlign = "left";
    	      ctx.textBaseline = "top";
            ctx.fillText("Título: " + partd().titulo + ": (ESPERANDO)", 850, 10);
          }

           //Jugadores
            ctx.fillStyle = "rgb(30, 144, 255)";
    	      ctx.font = "24px  Fantasía";
    	      ctx.textAlign = "left";
    	      ctx.textBaseline = "top";
            ctx.fillText("Jugadores: " + partd().listaJugadores, 850, 50);

            //Mazo
            ctx.fillStyle = "rgb(30, 144, 255)";
    	      ctx.font = "24px  Fantasía";
    	      ctx.textAlign = "left";
    	      ctx.textBaseline = "top";
            ctx.fillText("Mazo: " + mazLength(), 850, 80);

            //Roll
            ctx.fillStyle = "rgb(30, 144, 255)";
            ctx.font = "24px  Fantasía";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText("Roll: " + caracteristicas().roll, 850, 110);

            //Farolillo
            if (caracteristicas().farolillo){
                ctx.fillStyle = "rgb(30, 144, 255)";
                ctx.font = "24px  Fantasía";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Farolillo: Arreglado", 850, 140);
            } else {
                ctx.fillStyle = "rgb(30, 144, 255)";
                ctx.font = "24px  Fantasía";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Farolillo: Roto", 850, 140);
            }

            //Pico
            if (caracteristicas().pico){
                ctx.fillStyle = "rgb(30, 144, 255)";
                ctx.font = "24px  Fantasía";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Pico: Arreglado", 850, 170);
            } else {
              ctx.fillStyle = "rgb(30, 144, 255)";
              ctx.font = "24px  Fantasía";
              ctx.textAlign = "left";
              ctx.textBaseline = "top";
              ctx.fillText("Pico: Roto", 850, 170);
            }

            //Vagoneta
            if (caracteristicas().vagoneta){
                ctx.fillStyle = "rgb(30, 144, 255)";
                ctx.font = "24px  Fantasía";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Vagoneta: Arreglado", 850, 200);
            } else {
              ctx.fillStyle = "rgb(30, 144, 255)";
              ctx.font = "24px  Fantasía";
              ctx.textAlign = "left";
              ctx.textBaseline = "top";
              ctx.fillText("Vagoneta: Roto", 850, 200);
            }

            //Puntos
            ctx.fillStyle = "rgb(30, 144, 255)";
            ctx.font = "24px  Fantasía";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText("Puntos: " + caracteristicas().puntuacion, 850, 230);
        }
    }


    this.mover = function(mov){


        if (mov) {
          var sx=mov[1].sx
          var sy=mov[1].sy

          var pos_ini_x=mov[0][0]
          var pos_ini_y=mov[0][1]
          var pos_fin_x=mov[1].x
          var pos_fin_y=mov[1].y

          var desp_x=Math.abs(pos_ini_x-pos_fin_x)
          var desp_y=Math.abs(pos_ini_y-pos_fin_y)

          var dist=Math.sqrt(Math.pow(desp_x,2)+Math.pow(desp_y,2))
          var inc_x=desp_x/dist
          var inc_y=desp_y/dist

          for(var i=0; i<dist; i++){
            if (pos_ini_x<pos_fin_x) {var pos_x=parseInt(pos_ini_x+(i*inc_x))}
            else{var pos_x=parseInt(pos_ini_x-(i*inc_x))}

            if (pos_ini_y<pos_fin_y) {var pos_y=parseInt(pos_ini_y+(i*inc_y))}
            else{var pos_y=parseInt(pos_ini_y-(i*inc_y))}

            ctx1.drawImage(sprite,sx*wcard,sy*hcard,wcard,hcard,pos_x,pos_y,widht,height)
          }
        }
    }

    
    
    
    var mousedown = function (e) {
	turno = Partidas.findOne({_id: Session.get("selectedPartida")}).jugadorActivo;
	id = Meteor.userId()
  
  
	if (id==turno) {
  
	  var canvas_pos = canvas.getBoundingClientRect() ;
  
	  for (var i = 0; i < cartas_mano.length; i++) {
	    if ((cartas_mano[i].x<(e.clientX -canvas_pos.left) && (cartas_mano[i].x + widht)>(e.clientX-canvas_pos.left))&&
		(cartas_mano[i].y<(e.clientY -canvas_pos.top) && (cartas_mano[i].y + height)>(e.clientY-canvas_pos.top))) {
		cartas_mano[i].selec=true;
		distanciax=(e.clientX-canvas_pos.left-cartas_mano[i].x);
		distanciay=(e.clientY-canvas_pos.top-cartas_mano[i].y);
	    }
	  }
	}
    }

    
    var mouseup = function (e) {
	
	turno = Partidas.findOne({_id: Session.get("selectedPartida")}).jugadorActivo;
        id = Meteor.userId()

        if (id==turno) {

          var canvas_pos = canvas.getBoundingClientRect() ;

          for (var i = 0; i < cartas_mano.length; i++) {

            cartas_mano[i].selec=false;
            if ((cartas_mano[i].x<(e.clientX -canvas_pos.left) && (cartas_mano[i].x + widht)>(e.clientX-canvas_pos.left))&&
                (cartas_mano[i].y<(e.clientY -canvas_pos.top) && (cartas_mano[i].y + height)>(e.clientY-canvas_pos.top))) {

                cartas_mano[i].x =widht*parseInt((e.clientX -canvas_pos.left)/((widht)));
                cartas_mano[i].y=height*parseInt((e.clientY -canvas_pos.top)/(height));


                movimientos=[pos_ini,cartas_mano[i]]

                //id=Mov_card.findOne({partida_id:Session.get("selectedPartida")})._id
                //Mov_card.update({_id : id},{$set: {cartas_mano:movimientos}});

		var carta = $('#Mano option:selected').val();
		
		
		//console.log("FORMMM")
		//console.log(carta)
		
		var partidaId = Session.get("selectedPartida");
		var carta = cartas_mano[i].nombre;
		var tipo = $('#Tipo option:selected').val();
		var objetivo = $('#Objetivo option:selected').val();
		var objeto = $('#Objeto option:selected').val();
		var fila = ((cartas_mano[i].y)/(height))+11;
		var columna = (cartas_mano[i].x)/(widht);
		
		console.log("RATONNNNNN")
		console.log(carta)
		
		
		if(cartas_mano[i].y==(8)*height & cartas_mano[i].x==11*widht){
		  Meteor.call("pasarTurno", partidaId, Meteor.userId(),carta);
		}
		//else(tipo == "Poner"){
		else{
		  var posible=false
		  Meteor.call("ponerCarta", partidaId, Meteor.userId(),carta,parseInt(fila),parseInt(columna),objetivo,objeto,
		    function(err, data) {
		      console.log(data)
		      posible=data
		      if (err)
			console.log(err);
			posible=false
		    }
		  );
		  //console.log(Meteor.call("ponerCarta", partidaId, Meteor.userId(),carta,parseInt(fila),parseInt(columna),objetivo,objeto))
		  console.log(posible)
		  
		  if (posible) {
		    canvas.removeEventListener('mousemove',mousemove,false);
		    canvas.removeEventListener('mousedown',mousedown,false);
		    canvas.removeEventListener('mouseup',mouseup,false);
		  }
		  
		  
		}
                draw();

            }
          }
        }
    }

    
    
     
     
     
     
    var mousemove = function (e) {
        turno = Partidas.findOne({_id: Session.get("selectedPartida")}).jugadorActivo;
        id = Meteor.userId()

        if (id==turno) {

          var canvas_pos = canvas.getBoundingClientRect();

          for (var i = 0; i < cartas_mano.length; i++) {
            if (cartas_mano[i].selec==true) {

                //id=Mov_card.findOne({posicion:[ult_pos_x,ult_pos_y]})._id

                ult_pos_x=(e.clientX-canvas_pos.left)-distanciax;
                ult_pos_y=(e.clientY-canvas_pos.top)-distanciay;

                cartas_mano[i].x = ult_pos_x
                cartas_mano[i].y = ult_pos_y
                draw();
                //Mov_card.update({_id : id},{$set: {posicion:[ult_pos_x,ult_pos_y]}});

            }
          }
        }
    };

    Tracker.autorun(function () {
      console.log("Autorun")
      turno = Partidas.findOne({_id: Session.get("selectedPartida")}).jugadorActivo;
      id = Meteor.userId()
  
      if (id==turno) {
	console.log("Mi turno")
  
	canvas.addEventListener('mousedown',mousedown,false);
	canvas.addEventListener('mouseup',mouseup,false);
	canvas.addEventListener('mousemove',mousemove,false);
      }
    
    
      cartas_mano=[]
      cartas_db=Caracteristicas.findOne({partidaId: Session.get("selectedPartida"),jugadorId: Meteor.userId()}).mano;
      
      
      for (var i = 0; i < cartas_db.length; i++) {
	nombre=String(cartas_db[i])
	carta = new card((i+1),8,TiposCartas[nombre][0],TiposCartas[nombre][1],nombre)
	cartas_mano.push(carta);
      }
      
      //console.log(Caracteristicas.findOne({partidaId: Session.get("selectedPartida"),jugadorId: Meteor.userId()}).mano)
      
      draw();
      rend_Carac();
    });

}
