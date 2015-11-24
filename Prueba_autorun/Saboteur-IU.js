if (Meteor.isClient) {

  //Meteor.subscribe('theMov');

  /*Tracker.autorun(function (computation) {

      computation.stop();
      console.log("counter reached two");

  });*/
 var count = Session.set('count',0);
 var juego_ini = true;
  Tracker.autorun(function () {

    if (Session.get('count') === 1){
      console.log("Ha empezado el juego");
      juego_ini = false ;
    }
    console.log('Autorun is auto-running!');
    console.log(count);
  });

/*Tracker.autorun(function () {
    var mov =  Mov_card.find();
    console.log("121212")
  });*/

  Template.canvas.helpers({
    'mov_card': function(){
      return Mov_card.find();
    }
  });

  Template.canvas.events({
    'click .Start': function () {
      //Session.set("count", 1);
      //console.log("ha empezado el juego");

     if (juego_ini){
      Session.set("count",Session.get("count")+1);
      init();
    }
      else{
        alert ("No puedes empezar otra partida hasta que acabe la actual");
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('theMove_card', function(){

       return move_card.find()
  });
}


    //Diccionario de cartas
var TiposCartas = {
  camino1 : [4,1],
  camino2 : [5,1], //5,1 inversa,Tenemos que buscar como rotar la carta
  camino3 : [9,0],
  camino4 : [2,1],
  camino5 : [3,1],
  camino6 : [2,1], //2,1 inversa
  camino7 : [0,1],
  SinCamino1 : [4,0],//rotar
  SinCamino2 : [5,0],//rotar
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


function init() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var tablero= new Image();
    tablero.src='https://image.freepik.com/foto-gratis/plank--de-madera--textura--madera_318727.jpg'

    var sprite = new Image();
    sprite.src = 'sprites.png'

    var wcard=90
    var hcard=110
    var widht=60;
    var height=90;
    var can_widht=$('#canvas').attr('width');
    var can_height= $('#canvas').attr('height');
    var distanciax;
    var distanciay;


    function card(x,y,sx,sy) {
          this.x = x;
          this.y = y;
          this.sx=sx;
          this.sy=sy;
          this.selec=false;
      }

    card.prototype.draw = function (img,ctx) {
        return ctx.drawImage(img,this.sx*wcard,this.sy*hcard,wcard,hcard,this.x,this.y,widht,height);
    };



    var c_ini = new card(widht*3, height*3,TiposCartas["ComienzoEscalera"][0], TiposCartas["ComienzoEscalera"][1]);
    var mazo_1 = new card(widht*1,height*8 ,TiposCartas["camino1"][0], TiposCartas["camino1"][1]);
    var mazo_2 = new card(widht*2, height*8 ,TiposCartas["camino2"][0], TiposCartas["camino2"][1]);
    var mazo_3 = new card(widht*3, height*8 ,TiposCartas["camino3"][0], TiposCartas["camino3"][1]);
    var mazo_4 = new card(widht*4, height*8 ,TiposCartas["camino4"][0], TiposCartas["camino4"][1]);
    var mazo_5 = new card(widht*5, height*8 ,TiposCartas["camino5"][0], TiposCartas["camino5"][1]);
    var mazo_6 = new card(widht*6, height*8 ,TiposCartas["camino6"][0], TiposCartas["camino6"][1]);
    var destino1 = new card(widht*10, height*1 ,TiposCartas["CRevesDestino"][0], TiposCartas["CRevesDestino"][1]);
    var destino2 = new card(widht*10, height*3 ,TiposCartas["CRevesDestino"][0], TiposCartas["CRevesDestino"][1]);
    var destino3 = new card(widht*10, height*5 ,TiposCartas["CRevesDestino"][0], TiposCartas["CRevesDestino"][1]);

    var cartas=[c_ini,mazo_1,mazo_2,mazo_3,mazo_4,mazo_5,mazo_6];
    var cdestino = [destino1,destino2,destino3]


    function clear() {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    function draw() {

        clear();
        ctx.drawImage(tablero,0,0,can_widht,can_height);
        for (var i = 0; i < cartas.length; i++) {
            cartas[i].draw(sprite,ctx);
        }
       for (var j = 0 ;j < cdestino.length; j++){
            cdestino[j].draw(sprite,ctx);
        }

        window.requestAnimationFrame(draw);
    }



    canvas.addEventListener('mousedown', function(e){

        var canvas_pos = canvas.getBoundingClientRect() ;

        //console.log('--------')
        //console.log(canvas_pos.left )
        //console.log(canvas_pos.top)
        //console.log("eventoX " + parseInt(e.clientX-canvas_pos.left))
        //console.log("eventoY " + parseInt(e.clientY-canvas_pos.top))
        //console.log("obX " + parseInt(cartas[0].x))
        //console.log("obY " + parseInt(cartas[0].y))


        for (var i = 0; i < cartas.length; i++) {
            if ((cartas[i].x<(e.clientX -canvas_pos.left) && (cartas[i].x + widht)>(e.clientX-canvas_pos.left))&&
                (cartas[i].y<(e.clientY -canvas_pos.top) && (cartas[i].y + height)>(e.clientY-canvas_pos.top))) {
                cartas[i].selec=true;
                distanciax=(e.clientX-canvas_pos.left-cartas[i].x);
                distanciay=(e.clientY-canvas_pos.top-cartas[i].y);
            }
          }


    });




     canvas.addEventListener('mouseup', function(e){

        var canvas_pos = canvas.getBoundingClientRect() ;


        for (var i = 0; i < cartas.length; i++) {

            cartas[i].selec=false;
            if ((cartas[i].x<(e.clientX -canvas_pos.left) && (cartas[i].x + widht)>(e.clientX-canvas_pos.left))&&
                (cartas[i].y<(e.clientY -canvas_pos.top) && (cartas[i].y + height)>(e.clientY-canvas_pos.top))) {

                //console.log(parseInt((e.clientX -canvas_pos.left)/((can_widht/widht))))
                //console.log(parseInt((e.clientY -canvas_pos.top)/(can_height/height)))
                pos_ini=cartas[i];
                cartas[i].x =widht*parseInt((e.clientX -canvas_pos.left)/((widht)));
                cartas[i].y=height*parseInt((e.clientY -canvas_pos.top)/(height));
                //cartas[i].draw(sprite,ctx);

                Mov_card.insert({
                    posicion_inicial:pos_ini,
                    posicion_final: cartas[i],
                });
                Session.set("counter", Session.get("counter") + 1);

            }
        }
    });

    canvas.addEventListener('mousemove', function(e){

        var canvas_pos = canvas.getBoundingClientRect() ;

        for (var i = 0; i < cartas.length; i++) {
            if (cartas[i].selec==true) {
                clear();
                cartas[i].x = (e.clientX-canvas_pos.left)-distanciax;
                cartas[i].y = (e.clientY-canvas_pos.top)-distanciay;
                //cartas[i].draw(sprite,ctx);


            }
        }
    });


    draw();
}
