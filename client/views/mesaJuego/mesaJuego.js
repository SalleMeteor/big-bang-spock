var mesas = new Meteor.Collection('mesa');
//var PartidasJugador = new Meteor.Collection('partidaJugador');

var mesaActual = Session.get('mesa');
var mostrar = false;

//Esta variable nos dirá si podemos jugar o no
var jugable = true;

Session.set('reveal' , false);
Meteor.subscribe('getPartidaState' , Session.get('mesa') );
Meteor.subscribe('jugadas');
Meteor.subscribe('style');
Meteor.subscribe('creadorFuera');

Template.mesaJuego.jugar = function(){
  return jugable;
}

//Esta función reseteará la partida tras 3 segundos
function nextTurn(){

  Meteor.call('resetJugada' , Session.get('mesa') , Meteor.userId() );
  //alert('cambio!');
  Template.optionsBar.resetImages();
  jugable = true;
}

Template.mesaJuego.imagenResultado = function(imagenOriginal , oponente){

  var emp = 1;
  var vic = 0;
  var der = 0;
  
 // alert( Template.top.derrotasCount() );
  if( imagenOriginal.jugada == 0 )
    return 'images/back.png';
    
  
  var r = Template.mesaJuego.resultado( oponente  );
  
  var red = 'images/' + imagenOriginal.jugada;

  if( r == 'lose'){ emp--; der++; red += 'r'; }
  if( r == 'win') { emp--; vic++; red += 'g'; }
  
  Template.top.derrotasCount(der);
  Template.top.empatesCount(emp);
  Template.top.victoriasCount(vic);

 // cargaStatus();
  
  return red + '.png';
}

var resultado;

Template.mesaJuego.espera = function(){
  //Miramos si todos los jugadores ya han jugado, de ser así mostraremos las jugadas
  var l = Template.salaMesas.peoplePlayed( Session.get('mesa') );
  
  if( l > 0 )
    jugable = true;
  else
  {
    //Todos los jugadores han realziado una jugada
    //En 5 segundos saltaremos al siguiente turno
    setTimeout( nextTurn ,5000);
    jugable = false;
  }
  
  return ( l > 0 );
}


Template.mesaJuego.youSrc = function( src ){
    if( src.jugada == 0 )
    return 'images/back.png';
  
  return 'images/' + src.jugada + 'y.png';
}

Template.mesaJuego.mismo = function( id ){
  return Meteor.userId() == id;
}

Template.mesaJuego.showCards =  function(){
  return Session.get('reveal');
}
Template.mesaJuego.jugadas = function(){
  return Template.salaMesas.jugadas();
} 


Template.mesaJuego.events
(
  {
    //Pulsamos el boton mostrarCartas
    'click #show' : function(e)
    {
      Session.set('reveal' , !Session.get('reveal'));
    }
  }
); 


var current = 0;

Template.mesaJuego.style = function(){
  
  var total = Template.mesaJuego.jugadas().count();
  var angulo = ((2*3.1416))*(current/total);
  
  current++;
  
  //
  
  if( current >= total ) current = 0 ;
  //alert( current );
  return 'top : ' + (25*Math.cos(angulo) + 25) +'%; left : '+(35*Math.sin(angulo)+45)+'%;';
}

Template.mesaJuego.creadorFuera = function(){
  
 if( Session.get('role') == 'creator' || Session.get('mesa') == null  ) return;
  
  var p  = Template.salaMesas.peoplePlaying( Session.get('mesa') );
  
  if ( p < 1 )
  {
    Session.set('mesa',null);
    
    var notify = humane.create({ timeout: 4000, baseCls: 'humane-boldlight' });
    notify.log(['Table Creator Disconected',  'Returning to Tables Room']);
    
    //humane.log();  
  }
}

Template.mesaJuego.resultado = function( jugadaAdversario ){
  
  if( Session.get('role') == 'watch' ) return;
  
  var  resultado = "draw";
  var jugadaJugador =  Session.get('jugada');
  

  
  if( jugadaJugador != null )
  {
    if( jugadaAdversario == '0' )
      return 'win';
    
    if( jugadaAdversario != null )
    {
      switch( jugadaJugador )
      {
        case 'lizard' : 
          switch(jugadaAdversario)
          {
            case 'spock':    resultado='win'; break;
            case 'rock':     resultado='lose'; break;
            case 'paper' :   resultado='win'; break;
            case 'scissors': resultado='lose'; break;
          }
          break;
          
          
        case 'spock' :        
          switch(jugadaAdversario)
          {
            case 'lizard':    resultado='lose'; break;
            case 'rock':     resultado='win'; break;
            case 'paper' :   resultado='lose'; break;
            case 'scissors': resultado='win'; break;
          } 
          break;
          
          
        case 'rock' :
          switch(jugadaAdversario)
          {
            case 'lizard':    resultado='win'; break;
            case 'spock':     resultado='lose'; break;
            case 'paper' :   resultado='win'; break;
            case 'scissors': resultado='lose'; break;
          } 
          break;
        case 'paper' :
          switch(jugadaAdversario)
          {
            case 'lizard':    resultado='lose'; break;
            case 'spock':     resultado='win'; break;
            case 'rock' :   resultado='win'; break;
            case 'scissors': resultado='lose'; break;
          } 
          break;
        case 'scissors' : 
          switch(jugadaAdversario)
          {
            case 'lizard':    resultado='win'; break;
            case 'spock':     resultado='lose'; break;
            case 'rock' :   resultado='lose'; break;
            case 'paper': resultado='win'; break;
          } 
          break;
      }
    }
      else
      {
        resultado = 'win';
      }
  }
  else
    //Si el jugador no hace ninguna jugada pierde
  {
    
    resultado = 'lose';
  }
  
  return resultado;
}