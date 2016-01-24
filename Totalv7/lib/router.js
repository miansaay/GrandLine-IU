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
		data: function() { return Perfiles.findOne(this.params._id);
	},
	action:function(){
		if(this.ready()){this.render();}
	}
});
Router.route('/ranking',{name: 'ranking'});
Router.route('/ayuda',{name: 'ayuda',
template: 'ayuda'});

//Router.onBeforeAction('loading', {only: 'perfiles'});
