Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound'
  
});

Router.route('/perfil',{name: 'perfil',
template: 'perfil'});
Router.route('/',{name: 'home',
template: 'home'});
Router.route('/juego',{
	template: 'saboteur_temp'
});
Router.route('/perfiles/:_id',{
	name: 'perfiles',
	template:'perfiles',
		data: function() { return Perfiles.findOne({_id:this.params._id});
	},
	action:function(){
		if(this.ready()){this.render();}
	},
	waitOn:function(){
		return Meteor.subscribe('perfiles',this.params._id);
	}
});
Router.route('/ranking',{name: 'ranking'});
Router.route('/ayuda',{name: 'ayuda',
template: 'ayuda'});
/*var fuera = function(){
	if((!Meteor.user() || Meteor.loggingIn())){
		Router.route('/home');
	}else{
		this.next();
	}
}

Router.onBeforeAction(fuera);*/
