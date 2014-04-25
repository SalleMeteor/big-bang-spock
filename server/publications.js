//Publish de las 3 bases de datos
Meteor.publish("scores" , function( userId ) {
  puntuaciones.findOne({jugador:userId});
  return 
});

Meteor.publish("getAllMesas", function() {
  return Partidas.find();
});

Meteor.publish("getMesasData", function() {
  return PartidasJugador.find();
});