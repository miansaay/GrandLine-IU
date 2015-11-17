


function init() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var tablero= new Image();
    tablero.src='https://image.freepik.com/foto-gratis/plank--de-madera--textura--madera_318727.jpg'

    var sprite = new Image();
    sprite.src = 'sprites.png'

    var wcard=90
    var hcard=110
    var widht=50;
    var height=50;
    var can_widht=1000;
    var can_height=600;

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
       Saboteador : [0,5], //definir más adelante en función de los colores
       Minero : [0,4],//definir también en función de colores
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
       Derrumbamiento : [3,1]
       CRevesCamino : [4,3],
       CRevesDestino : [5,3],
       CRevesPepita : [7,3],
       CRevesPersonaje : [6,3]
    }


    /*var card2 = {
        x: 100,
        y: 200,
        widht:60,
        height:90,
        selec:false,
        draw: function() {
            ctx.drawImage(sprite,TiposCartas.camino3[0]*wcard,TiposCartas.camino3[1]*hcard,wcard,hcard,this.x,this.y,this.widht,this.height);
        }
    };*/
    var card1 = {
        x: 100,
        y: 200,
        widht:60,
        height:90,
        selec:false,
        draw: function() {
            ctx.drawImage(sprite,TiposCartas. Saboteador[0]*wcard,TiposCartas. Saboteador[1]*hcard,wcard,hcard,this.x,this.y,this.widht,this.height);
        }
    };

    var cartas=[card1]

    function clear() {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    function draw() {

        clear();
        ctx.drawImage(tablero,0,0,1000,800);
        for (var i = 0; i < cartas.length; i++) {
            cartas[i].draw(sprite,ctx);
        }

        window.requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousedown', function(e){

        var p = $( "canvas" );
        var position = p.position();
        //console.log("lao")
        //console.log(position.left)
        //console.log(position.top)

        for (var i = 0; i < cartas.length; i++) {
            if ((cartas[i].x<(e.clientX -100) && (cartas[i].x+cartas[i].widht)>(e.clientX-100))&&
                (cartas[i].y<(e.clientY -100) && (cartas[i].y+cartas[i].height)>(e.clientY-100))) {
                console.log(cartas[i].selec);
                cartas[i].selec=true;
            }
          }


    });

     canvas.addEventListener('mouseup', function(e){
        for (var i = 0; i < cartas.length; i++) {
            cartas[i].selec=false;
        }
    });

    canvas.addEventListener('mousemove', function(e){
        for (var i = 0; i < cartas.length; i++) {
          if (cartas[i].selec){
            console.log(cartas[i].selec);
          }

            if (cartas[i].selec==true) {
                clear();
                cartas[i].x = e.clientX-100;
                cartas[i].y = e.clientY-100;
                cartas[i].draw(sprite,ctx);
            }
        }
    });


    ctx.drawImage(tablero,0,0,1000,800);
    for (var i = 0; i < cartas.length; i++) {
            cartas[i].draw(sprite,ctx);
    }


    window.requestAnimationFrame(draw);
}
