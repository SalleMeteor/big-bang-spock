Template.optionsBar.created = function(){
  Session.set('jugada' ,  null );
}

Template.optionsBar.gamer = function(){
  
  var role = Session.get('role');
  return (  role == 'player' || role =='creator' );
}

Template.optionsBar.events
( 
  {
    //Colocamos el cursor sobre cualquier image de la clase "card"
     'mouseenter img.option' : function(e)
    {
      e.target.style.width="12%";
      //alert(e.target.src);
    },
    //Quitamos el cursor de la carta sobre la que estabamos de la clase "card"
    'mouseleave img.option' : function(e)
    {
      e.target.style.width="10%";
      //alert('Cast off');
    },
    //Pulsamos encima de una carta, su nombre se guardará
    'click img.option' : function(e)
    {
      if( !Template.mesaJuego.jugar() ) return;
      
      resetImages();
      Meteor.call('eleccion' , Session.get('mesa') , Meteor.userId() , e.target.id , e.target.src);
      e.target.src = "images/" + e.target.id + "g.png";
      Session.set('jugada' ,  e.target.id );
    },
    //Pulsamos el boton de salir
    'click #salir' : function(e)
    {
      //Si sale el creador de la mesa, la mesa desaparecerá también
      Meteor.call('eliminaMesa', Session.get('mesa'), Meteor.userId() );
      Session.set('mesa',null);
    }
  }
);


Template.optionsBar.resetImages = function(){
  resetImages();
}


function resetImages(){
  document.getElementById("spock").src = "images/spock.png";
  document.getElementById("rock").src = "images/rock.png";
  document.getElementById("paper").src = "images/paper.png";
  document.getElementById("lizard").src = "images/lizard.png";
  document.getElementById("scissors").src = "images/scissors.png";
}