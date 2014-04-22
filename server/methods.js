//Todas las mesas con gente jugando 
var Partidas = new Meteor.Collection('partida');
//Todas las jugadas realizadas durante la partida
var mesas = new Meteor.Collection('mesa');
//Esta colección servirá para saber la gente que hay jugando actualmente y sus jugadas
var PartidasJugador = new Meteor.Collection('partidaJugador');
//Esta función controla las puntuaciones de los jugadores
var puntuaciones = new Meteor.Collection('scores');

Meteor.methods
  (

    {
      //Esta función nos devuelve los datos del jugador
      getScrote: function( userId ){
        var data = puntuaciones.findOne({jugador:userId});
        if( data == undefined ){
         puntuaciones.insert({jugador:userId, ok : 0 , ko : 0 , draw : 0});
           data = puntuaciones.findOne({jugador:userId});/**/
        }
        return data;
      },
      //Función que actualiza la puntuación del jugador
      updateScrote: function( userId , okR , koR , drawR ){
        puntuaciones.update( {jugador:userId} , { $set: { ok : okR , ko : koR , draw : drawR}} );
         return 'updated';
      },      
      //Función para saber si el usuario ya está en una partida
      getMesa : function( userId ){
        return PartidasJugador.findOne({jugador: userId}).name;
      },  
      //Función para eliminar una mesa, sólo se podrá eliminar si se es el creador
      eliminaMesa: function (mesaId, userId) {
        if(Partidas.find({name:mesaId, creator:userId}).count() < 1 ){
           PartidasJugador.remove( {name: mesaId  , jugador: userId } );
           Partidas.remove({name:mesaId, creator:userId});
          return 'NEIN';
        }
        //Otherwise
        mesas.remove({mesa:mesaId});
        Partidas.remove({name:mesaId, creator:userId});
        PartidasJugador.remove({name:mesaId});
        return "some return value";
      },
    
      //Función para crear una mesa
      creaMesa: function (mesaId, userId) {
        Partidas.insert( {name: mesaId  , creator: userId , visible: false} );
        //Cuando creemos una partida, el jugador que haya creado la partida será el primero en apuntarse al juego
        PartidasJugador.insert( {name: mesaId  , jugador: userId, jugada: '0' , src:'images/back.png' } );
        return mesaId;
      },
      
      //Función para unirse a una partida
      joinMesa: function( mesaId,userId){
        PartidasJugador.insert( {name: mesaId  , jugador: userId, jugada: '0' , src:'images/back.png' } );
        return mesaId;
      },
      //Función resetear la jugada de un jugador
      resetJugada: function( mesaId,userId){
        PartidasJugador.update( {name: mesaId  , jugador: userId} , {$set: { jugada: '0' , src:'images/back.png' }} );
        return mesaId;
      },      
      //Función para seleccionar una jugada
      eleccion: function(mesaId , userId, jugadaId , srcId ){
         PartidasJugador.update( {name: mesaId  , jugador: userId} , {$set: { jugada: jugadaId , src:srcId }} );
        // PartidasJugador.insert( {name: mesaId  , jugador: userId, jugada: jugadaId , src:srcId } );
        return mesaId;
      }
    }
  );
    