sprite = new Image();
sprite.src = 'sprites.png'

wcard=90
hcard=110
widht=60;
height=90;

//Diccionario de cartas
TiposCartas = {
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

carta = function (x,y,sx,sy,nombre) {
      this.x = x*widht;
      this.y = y*height;
      this.sx=sx;
      this.sy=sy;
      this.nombre=nombre;
      this.selec=false;

      this.draw = function (img, ctx) {
            return ctx.drawImage(img, this.sx*wcard,this.sy*hcard,wcard,hcard,this.x,this.y,widht,height);
      }
}