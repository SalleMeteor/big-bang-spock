var partidas = new Meteor.Collection('partida');
var partidasJugador = new Meteor.Collection('partidaJugador');

Meteor.subscribe('getAllMesas');
Meteor.subscribe('scores');
Meteor.subscribe('getMesasData');

Template.salaMesas.quedaSitio= function( mesaId ) {
  return Template.salaMesas.peoplePlaying(mesaId) < 5 ;
}

Template.salaMesas.noJugado = function(){
  var j = partidasJugador.find( {name: Session.get('mesa')  , jugador: Meteor.userId() } );
}

Template.salaMesas.peoplePlayed = function( mesaId ){
  return partidasJugador.find({ name: mesaId , src: 'images/back.png'}).count(); 
}

Template.salaMesas.peoplePlaying = function(mesaId){
  return partidasJugador.find( { name : mesaId } ).count();
}


Template.salaMesas.jugadas = function(){
     var m = Session.get('mesa');
      return partidasJugador.find( {name:m} );
}

Template.salaMesas.creador = function( creadorMesa ){
  return ( creadorMesa == Meteor.userId() );
}

Template.salaMesas.partidasActivas = function(){
  return partidas.find();
}

Template.salaMesas.events
(
  {
    //Pulsamos encima de una carta, su nombre se guardará
    'click input#joinTable' : function(e)
    {
      Session.set('mesa' ,  e.target.name );
      Session.set('role' , 'player');
      Meteor.call('joinMesa', e.target.name , Meteor.userId());
    },
     //Nos unimos como espectadores en la pantalla
    'click input#watchTable' : function(e)
    {
      Session.set('mesa' ,  e.target.name );
      Session.set('role' , 'watch');
    },   
    //Pulsamos el boton de eliminar mesa
    'click input.borrar' : function(e)
    {
      //partidas.remove( {name: e.target.name } );
      Meteor.call('eliminaMesa', e.target.name, Meteor.userId());
      //alert("Delete " + e.target.name);
    },
  
    
    //Creamos una nueva mesa enviando el mensaje directamente al servidor
    'click #crear' : function(e)
    {
      
      var nombre = document.getElementById('nombreMesa').value;
      
      if( nombre.length>0 && partidas.find( { name : nombre } ).count() == 0 )
      {
        Meteor.call('creaMesa', nombre, Meteor.userId());
        Session.set('role' , 'creator');
        Session.set('mesa' ,  nombre );
      }
      else
      {
        var notify = humane.create({ timeout: 4000, baseCls: 'humane-boldlight' });
        notify.log('Invalid name');
      }

    },
    
    'keydown #nombreMesa' : function(e)
    {
      //alert( e.which );
      //Si pulsamos la tecla ENTER crearemos también la mesa
      if( e.which != 13 ) return;
      
      var nombre = document.getElementById('nombreMesa').value;
      
      if( nombre.length>0 && partidas.find( { name : nombre } ).count() == 0 )
      {
        Meteor.call('creaMesa', nombre, Meteor.userId());
        Session.set('role' , 'creator');
        Session.set('mesa' ,  nombre );
      }
      else
      {
        var notify = humane.create({ timeout: 4000, baseCls: 'humane-boldlight' });
        notify.log('Invalid name');
      }

    }
  }
);

//Si cerramos la ventan cerraremos nuestra sesión en el juego
window.onbeforeunload = function (event) {
      Meteor.call('eliminaMesa', Session.get('mesa'), Meteor.userId() );
      Session.set('mesa',null);
};

