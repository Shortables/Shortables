const db = require("../models");

function map_posts( post_arr, user_posts_arr ){

	let post_map = {};
	for(let i=0; i < user_posts_arr.length; i++){
		let post = user_posts_arr[i];
		post_map[post.id] = [
			post.favorites,
			post.rated
		];
	}
	for(let i=0; i < shortables.length; i++){
		let post_id = shortables[i].id;
		shortables[i].fav = post_map[post_id][0];
		shortables[i].rated = post_map[post_id][1];
	}
	return short_arr;
}

module.exports = function(app) {

	app.get("/api/shortables/all", function(req, res) {
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: ['id','title','content','rating','voted'],
			where: { published: true },
			limit: 100,
			order: [['updatedAt', 'DESC']],
			include: [{ model: db.User, attributes: user_attr}]

		}).then(function(shortables) {
		
			if(req.user && shortables.length ){
			//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					map_posts( shortables, user_posts )				
				});
			}

			res.json(shortables);

		});
	});

	app.get("/api/shortables/popular/:time?", function(req, res) {

		let query = { published: true };
		let period = req.params.time;
		let startDate = new Date();
		startDate.setDate(oneWeekAgo.getDate() - 7);
		if(period){

			switch(period){
				case 'day': startDate.setDate(oneWeekAgo.getDate() - 1); break;
				case 'week': startDate.setDate(oneWeekAgo.getDate() - 7); break;
				case 'month': startDate.setDate(oneWeekAgo.getDate() - 30); break;
			}
			query.updatedAt = { 
				[db.Sequelize.Op.gte]: startDate
			};
		}
		let post_attr = ['id','title','content','rating','voted'];
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: post_attr,
			where: query,
			limit: 100,
			order: ['rating', 'updatedAt','DESC'],
			include: [{model: db.User, attributes: user_attr}]
			// group: [db.Sequelize.fn('date_trunc', 'day', db.Sequelize.col('createdAt'))]
		}).then(function(shortables) {
			if(req.user && shortables.length ){
			//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					map_posts( shortables, user_posts )				
				});
			}
			res.json(shortables);
		});
	});

	app.get("/api/shortables/author/:userId", function(req, res){
		let condition = {
			UserId : req.params.userId,
			published : true
		};
		let post_attr = ['id','title','content','rating'];
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: post_attr,
			where: condition,
			order: [['updatedAt', 'DESC']],
			include: [{ model: db.User, attributes: user_attr}]

		}).then(function(shortables) {
			if(req.user && shortables.length ){
			//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					map_posts( shortables, user_posts )				
				});
			}
			res.json(shortables);
		});

	});

	app.get("/api/shortables/owner", function(req, res){
		let condition = {};
		if(req.user){
			let condition = {
				UserId : req.user.id
			};
			let post_attr = ['id','title','content','rating', 'voted','published'];
			let user_attr = ['username','firstname','lastname','picture'];
			db.Post.findAll({
				attributes: post_attr,
				where: condition,
				order: [['updatedAt', 'DESC']],
				include: [{ model: db.User, attributes: user_attr}]

			}).then(function(shortables) {
				res.json(shortables);
			});
		}
	});

	//get a single shortable
	app.get("/api/shortable/:id", function(req, res) {
		
		let post_attr = ['id','title','content','rating', 'voted','published'];
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findOne({
			attributes: post_attr,
			where: { id: req.params.id },
			include: [{ model: db.User, attributes: user_attr}]

		}).then(function(shortable) {
			if( shortable.published === true || 
			(req.user && req.user.id === shortable.UserId)){
				res.json(shortable);
			}
			else {
				res.status(401).send({});
			}
		});
	});

	// saving a new shortable
	app.post("/api/shortable/add", function(req, res) {
		//required fields: title, content, UserId
		if(req.user){
			let post = req.body;
			post.UserId = req.user.id;
			db.Post.create(post).then(function(shortable) {
				res.json(shortable);
			});
		}
		else {
			res.status(404).send();
		}
	});


	app.put("/api/shortable/update/:id", function(req, res) {
		// title, content, published flag
		if(req.user && req.user.id === req.body.UserId)
		db.Post.update(
			req.body,
			// { id: req.body.id }
			{ where: { id: req.body.id } }
		).then(function(shortable) {
			res.json(shortable);
		});
	});
	
	// voting
	app.put("/api/shortable/vote/:id", function(req, res){
		//vote for post (id)
	});

	//adding to fav list
	app.put("/api/shortable/add-to-favorites", function(req, res){

	});

	app.get("*", function(req, res) {
		res.redirect('/shortables/all');
		// res.sendFile(path.join(__dirname, "../public/home.html"));
	});
};
