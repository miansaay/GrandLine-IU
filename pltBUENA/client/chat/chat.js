Meteor.subscribe("messages");

Deps.autorun(function() {
    Meteor.subscribe('messages', { 
          onReady : function() {
              Session.set("active", true); 
          }
    });
  });

Template.chat.events({
         'submit form': function(event) {
            event.preventDefault();
            var currentUser = Meteor.user().username;
            var post = {
                nick : currentUser,
                message : $(event.target).find('[name=message]').val()
            }
            if ( (post.message != "") && (post.nick != "") ) {
                Meteor.call("addMessage", post);
            }
            $('[name="message"]').val('');

        }
      });

       Template.chat.helpers({
           latestMessages : function() {
                 if (Session.get("active")) {
                    var UltimosMensajes = Messages.find({session : Session.get("home")}, {sort : {time : -1}, limit : 10}).fetch().reverse();
                     return UltimosMensajes;
                 } else {
                     return [];
                 }
            }
       });