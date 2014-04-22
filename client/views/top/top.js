Meteor.subscribe("mesa");

var victoriasCount = 0;
var derrotasCount = 0;
var empatesCount = 0;

Template.top.mesa = function()
{
   return Session.get('mesa');
} 

Template.top.empatesCount = function(value){
  empatesCount += value;
  cargaStatus();
  return empatesCount;
}
Template.top.derrotasCount = function(value){
  derrotasCount += value;
  cargaStatus();
  return derrotasCount;
}
Template.top.victoriasCount = function(value){
  victoriasCount += value;
  cargaStatus();
  return victoriasCount;
}
Template.top.created = function(){
  Meteor.call('getScrote', Meteor.userId(),             
        function( error, result)
        {
          victoriasCount = result.ok;
          derrotasCount = result.ko;
          empatesCount = result.draw;
          cargaStatus();
        }
   );
}

function cargaStatus(){
  
  Meteor.call('updateScrote', Meteor.userId(),  victoriasCount , derrotasCount , empatesCount  );
  
  document.getElementById('victorias').innerHTML ="Victories: " +  victoriasCount + "  ";
  document.getElementById('empates').innerHTML ="Draws: " +   empatesCount  + "  ";
  document.getElementById('derrotas').innerHTML ="Losses: " +   derrotasCount  + "  ";
}