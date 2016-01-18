Meteor.methods ({
    insertRanking : function (name, points) {
		if (this.userId)
        Ranking.insert({
            user_id:Perfiles.findOne({nick: name}),
				juego: "Saboteur",
				puntos: points,
				ultPartida: Date.now(),
        });

   },

    updateRanking : function (name, points) {
		var jugador = Perfiles.findOne({nick: name});
		if (this.userId)
        Ranking.update({user_id:jugador._id}, {$set: {puntos: points, ultPartida: Date.now()}});

   },

    insertPointsAllien : function ( points) {
		if (this.userId)
			     var aux = Ranking.findOne({user_id:this.userId, juego: "Allien"});
		     if(aux){
		         Ranking.update({user_id:this.userId},{$set: {puntos: points, ultPartida: Date.now()}});

		     }else{
				Ranking.insert({
		         user_id:this.userId,
					juego: "Allien",
					puntos: points,
					ultPartida: Date.now(),
				});
		     }

    },


});
