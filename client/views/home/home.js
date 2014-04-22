Meteor.subscribe("mesa");

Template.home.created = function(){
  Session.set('mesa',null);
}

Template.home.mesa = function(){
  return Session.get('mesa');
}