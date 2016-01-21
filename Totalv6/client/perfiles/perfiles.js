//var idOtro=document.URL.slice(31,100);
//var existeListaAmigos =false;
Meteor.subscribe("perfiles");
Template.perfiles.helpers({

	'imagen':function(){
		
		idOtro=document.URL.slice(31,100);
		 imagenOtro =Meteor.users.findOne({_id:idOtro});
		return imagenOtro.profile.image;
	},
	'nicky':function(){
		idOtro=document.URL.slice(31,100);
		perfil=Perfiles.findOne({_id:idOtro});

		return perfil.nick;
	},
	'email':function(){
		idOtro=document.URL.slice(31,100);
		perfil=Perfiles.findOne({_id:idOtro});
		return perfil.email;
	},
	'nombre':function(){
		idOtro=document.URL.slice(31,100);
		perfil=Perfiles.findOne({_id:idOtro});
		return perfil.nombre;
	},
	'nacionalidad':function(){
		idOtro=document.URL.slice(31,100);
		perfil=Perfiles.findOne({_id:idOtro});
		return perfil.nacionalidad;
	},
	'genero':function(){
		idOtro=document.URL.slice(31,100);
		perfil=Perfiles.findOne({_id:idOtro});
		return perfil.genero;
	},
	'amigos':function(){
		a=[];
		idOtro=document.URL.slice(31,100);
		for(i=0;i<Amigos.findOne({_id:idOtro}).usernames.length;i++){
		a.push(Meteor.users.findOne({_id:Amigos.findOne({_id:idOtro}).usernames[i].idAmigo}))
		}
		return a;
	},
	'esAmigo':function(){
		idOtro=document.URL.slice(31,100);
		encontrado=false;
		maximo=Amigos.find({_id:Meteor.userId()}).fetch()[0].usernames.length;
		for(i=0;i<maximo;i++){
			if(Amigos.find({_id:Meteor.userId()}).fetch()[0].usernames[i].idAmigo == idOtro)
				encontrado=true;
		}
		return encontrado;

	}


});
existeListaAmigos=Amigos.find({id:Meteor.userId()}).fetch().length;
Template.perfiles.events({
	'click #botonponerAmigo':function(){
		idOtro=document.URL.slice(31,100);
		console.log("AÑADIR AMIGO");
		perfil_username=Perfiles.findOne({_id:idOtro}).nick;
		id_usuario=Meteor.user()._id;
		fotoAmigo=Meteor.users.findOne({_id:idOtro}).profile.image;
		//existeListaAmigos=Amigos.find({id:Meteor.userId()}).fetch().length;
		if(!existeListaAmigos){
			Amigos.insert({_id:id_usuario,usernames:[{idAmigo:idOtro,username:perfil_username}]});
			existeListaAmigos=true;
		}else{
			
			Amigos.update({_id:id_usuario},{$push:{usernames:{idAmigo:idOtro,username:perfil_username}}});
		}	
	},
	'click .list-group-item':function(){
		console.log("He pulsado");
		
		//location.reload();
	},
	'click #botonquitarAmigo':function(){
		idOtro=document.URL.slice(31,100);
		console.log("KITAR AMIGO");
		perfil_username=Perfiles.findOne({_id:idOtro}).nick;
		id_usuario=Meteor.user()._id;
		fotoAmigo=Meteor.users.findOne({_id:idOtro}).profile.image;
		
			Amigos.update({_id:id_usuario},{$pull:{usernames:{idAmigo:idOtro,username:perfil_username}}});
		
			//console.log("FALLO AL KITAR AMIGO");
			
	}
	
});

/*Tracker.autorun(function(){
	
	idOtro=document.URL.slice(31,100);
		console.log("Actualizar amigo AMIGO");
		perfil_username=Perfiles.findOne({_id:idOtro}).nick;
		id_usuario=Meteor.user()._id;
		fotoAmigo=Meteor.users.findOne({_id:idOtro}).profile.image;
		
			Amigos.update({_id:id_usuario},{$set:{usernames:{idAmigo:idOtro,username:perfil_username,foto:fotoAmigo}}});
		
});*/
