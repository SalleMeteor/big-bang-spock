//Todas las mesas con gente jugando 
Partidas = new Meteor.Collection('partida');

/*var partidas = new Meteor.Collection('partida');

//Hay que configurar los permisos de las bbdd a los que se quieren acceder
partidas.allow({
  insert: function(partidaId) {
    return true;
  },
  update: function() {
    return false;
  },	
  remove: function(partidaId) {
    return true;
  }
});*/