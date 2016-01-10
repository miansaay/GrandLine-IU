Router.route('/register' , function() {
	this.render('register' , {to: "container"});
});

Router.route('/login' , function() {
	this.render('login', {to: "container"});
});

Router.route('/' , function() {
	this.render('home', {to: "container"})
},{
	name: 'home',
});

Router.configure({
	layoutTemplate: 'main',
});











