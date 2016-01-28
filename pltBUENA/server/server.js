
Meteor.publish('messages', function(salon) {
   return Messages.find( {}, {sort : {time : -1}, limit : 500} );
});
Meteor.publish('perfiles',function(){
	return Perfiles.find({});

});
Meteor.publish('amigos',function(){
	return Amigos.find({});
	
});
Meteor.publish('users',function(){
	if(this.userId){
		return Meteor.users.find({},{fields:{username:1,_id:1,profile:1,status:1}});
	}else{
		this.ready()
	}
});

Meteor.methods ({
    addMessage : function (post) {
        var timestamp = Math.round(new Date().getTime() / 1000);
        Messages.insert({
            nick : post.nick,
	    session : post.session,
            message : post.message,
            time : timestamp
        });
    },
    addPerfil : function (post) {
        Perfiles.insert({
            _id:post._id,
            nick : post.nick,
            email : post.email,
            nombre : post.nombre,
            nacionalidad:post.nacionalidad,
            genero:post.genero
        });
    },
    updatePerfil:function(id,usuario,email,nombre,nacionalidad,genero){
    	Perfiles.update({_id:id},{
            	$set:{
    		
    		nick:usuario,
    		email:email,
    		nombre:nombre,
    		nacionalidad:nacionalidad,
    		genero:genero}
    	});
    },
	    kitarAmigos:function(id_usuario,idOtro,perfil_username){
        Amigos.update({_id:id_usuario},{$pull:{usernames:{idAmigo:idOtro,username:perfil_username}}});

    },
    ponerAmigos:function(id_usuario,idOtro,perfil_username){
        Amigos.update({_id:id_usuario},{$push:{usernames:{idAmigo:idOtro,username:perfil_username}}});

    },
    crearAmigos:function(id_usuario,idOtro,perfil_username){
        Amigos.insert({_id:id_usuario,usernames:[{idAmigo:idOtro,username:perfil_username}]});
    }
});
Amigos.allow({
	insert:function(userId,doc){
		return Meteor.userId();
	},
	update:function(userId,doc){
		return Meteor.userId();
	}
});
Perfiles.allow({
	insert:function(userId,doc){
		return Meteor.userId();
	},
	update:function(userId,doc){
		return Meteor.userId();
	}
});
