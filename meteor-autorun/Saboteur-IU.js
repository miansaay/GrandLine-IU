if (Meteor.isClient) {

  //Meteor.subscribe('theMov');

  Tracker.autorun(function () {
    if (Mov_card.findOne()!==undefined) {
      if (Mov_card.findOne({name:"ultima_pos"}).cartas!==0) {
        //code

      //if ( $("#canvas1").length) {
        //$(document).ready(function() {
        console.log("movimiento autorun");

        var movimiento = Mov_card.find().fetch();
        console.log(movimiento);

        var canvas = document.getElementById('canvas1');
        //console.log(canvas)
        //var ctx = canvas.getContext('2d');



        //if (movimiento[0]!==0) {
           //mover1(movimiento);
           //console.log("entra")
        //}


      //});
      //}
      }
    }


  });


  Template.canvas.helpers({
    'mov_card': function(){
      return Mov_card.find();
    }
  });

  Template.canvas.events({
    'click .Start': function () {

        if (Mov_card.findOne()!==undefined) {
          id=Mov_card.findOne({name:"ultima_pos"})._id

          Mov_card.remove(id)
        }


        Mov_card.insert({
          name:"ultima_pos",
          cartas:0
        });

      init();

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
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




function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function mover1(mov){

    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');

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

        ctx.drawImage(sprite,sx*wcard,sy*hcard,wcard,hcard,pos_x,pos_y,widht,height)
      }
    }
}



function init() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var canvas1 = document.getElementById('canvas1');
    var ctx1 = canvas.getContext('2d');

    var distanciax;
    var distanciay;
    var pos_ini;

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

    var cartas=[c_ini,mazo_1,mazo_2,mazo_3,mazo_4,mazo_5,mazo_6,destino1,destino2,destino3]


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

        window.requestAnimationFrame(draw);
    }


    this.mover = function(mov){

        var canvas = document.getElementById('canvas1');
        var ctx = canvas.getContext('2d');

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

            ctx.drawImage(sprite,sx*wcard,sy*hcard,wcard,hcard,pos_x,pos_y,widht,height)
          }
        }
    }



    canvas.addEventListener('mousedown', function(e){

        var canvas_pos = canvas.getBoundingClientRect() ;

        for (var i = 0; i < cartas.length; i++) {
            if ((cartas[i].x<(e.clientX -canvas_pos.left) && (cartas[i].x + widht)>(e.clientX-canvas_pos.left))&&
                (cartas[i].y<(e.clientY -canvas_pos.top) && (cartas[i].y + height)>(e.clientY-canvas_pos.top))) {
                cartas[i].selec=true;
                distanciax=(e.clientX-canvas_pos.left-cartas[i].x);
                distanciay=(e.clientY-canvas_pos.top-cartas[i].y);
                pos_ini=[cartas[i].x,cartas[i].y];

            }
          }


    });




     canvas.addEventListener('mouseup', function(e){

        var canvas_pos = canvas.getBoundingClientRect() ;


        for (var i = 0; i < cartas.length; i++) {

            cartas[i].selec=false;
            if ((cartas[i].x<(e.clientX -canvas_pos.left) && (cartas[i].x + widht)>(e.clientX-canvas_pos.left))&&
                (cartas[i].y<(e.clientY -canvas_pos.top) && (cartas[i].y + height)>(e.clientY-canvas_pos.top))) {

                cartas[i].x =widht*parseInt((e.clientX -canvas_pos.left)/((widht)));
                cartas[i].y=height*parseInt((e.clientY -canvas_pos.top)/(height));


                movimientos=[pos_ini,cartas[i]]

                id=Mov_card.findOne({name:"ultima_pos"})._id
                Mov_card.update({_id : id},{$set: {cartas:movimientos}});


                //mover(movimientos);

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

            }
        }
    });


    draw();
}
