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
      Derrumbamiento : [3,1],
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


    function card(x,y,sx,sy) {
          this.x = x*widht;
          this.y = y*height;
          this.sx=sx;
          this.sy=sy;
          this.selec=false;
      }

    card.prototype.draw = function (img,ctx) {
        return ctx.drawImage(img,this.sx*wcard,this.sy*hcard,wcard,hcard,this.x,this.y,widht,height);
    };


    var cartas_mano=[]

    function clear() {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    function draw() {

        clear();


        ctx.drawImage(tablero,0,0,can_widht,can_height);

        for (var i = 0; i < cartas_mano.length; i++) {
            cartas_mano[i].draw(sprite,ctx);
        }

        //window.requestAnimationFrame(draw);
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



    canvas.addEventListener('mousedown', function(e){

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


    });




     canvas.addEventListener('mouseup', function(e){

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

                draw();

                //llamar a la logica

            }
          }
        }
    });

    canvas.addEventListener('mousemove', function(e){

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
    });



    cartas_mano=[]
    cartas_db=Caracteristicas.findOne({partidaId: Session.get("selectedPartida"),jugadorId: Meteor.userId()}).mano;


    for (var i = 0; i < cartas_db.length; i++) {
      nombre=String(cartas_db[i])
      console.log(nombre)
      carta = new card((i+1),8,TiposCartas[nombre][0],TiposCartas[nombre][1])
      cartas_mano.push(carta);
    }

    draw();
}
