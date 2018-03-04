const db = require("../models");

function map_posts( post_arr, user_posts_arr ){
	let posts = post_arr;
	let post_map = {};
	for(let i=0; i < user_posts_arr.length; i++){
		let post = user_posts_arr[i];
		post_map[post.PostId] = [
			post.favorites,
			post.rated
		];
	}
	for(let i=0; i < posts.length; i++){
		let post_id = posts[i].id;
		if(post_map[post_id]){
			let post_obj = posts[i].toJSON();
			post_obj.fav = post_map[post_id][0];
			post_obj.rated = post_map[post_id][1];
			posts[i] = post_obj;
		}
	}
	return posts;
}

module.exports = function(app) {

	app.get("/api/shortables/all", function(req, res) {
		const user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: ['id','title','content','rating','voted'],
			where: { published: true },
			limit: 100,
			order: [['createdAt', 'DESC']],
			include: [{ model: db.User, attributes: user_attr}]

		}).then(function(shortables) {
			if(req.user && shortables.length ){
				console.log("\n+++\n");
			//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					if(user_posts.length){				
						map_posts( shortables, user_posts );
						res.json(shortables);
					}
				});
			}
			else{
				res.json(shortables);
			}

		});
	});

	app.get("/api/shortables/popular/:time?", function(req, res) {

		let query = { published: true };
		let period = req.params.time;
		let startDate = new Date();
		if(period){

			switch(period){
				case 'day': startDate.setDate(startDate.getDate() - 1); break;
				case 'week': startDate.setDate(startDate.getDate() - 7); break;
				case 'month': startDate.setDate(startDate.getDate() - 30); break;
			}
			query.updatedAt = { 
				[db.Sequelize.Op.gte]: startDate
			};
		}
		const post_attr = ['id','title','content','rating','voted'];
		const user_attr = ['id','username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: post_attr,
			where: query,
			limit: 100,
			// order: [['rating']],
			order: [['rating','DESC'],['createdAt', 'DESC']],
			include: [{model: db.User, attributes: user_attr}]
			// group: [db.Sequelize.fn('date_trunc', 'day', db.Sequelize.col('createdAt'))]
		}).then(function(shortables) {
			if(req.user && shortables.length ){
			//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					if(user_posts.length){				
						map_posts( shortables, user_posts );
						res.json(shortables);
					}
				});
			}
			else{
				res.json(shortables);
			}
		});
	});

	app.get("/api/shortables/author/:userId", function(req, res){
		let condition = {
			UserId : req.params.userId,
			published : true
		};
		const post_attr = ['id','title','content','rating'];
		const user_attr = ['username','firstname','lastname','picture'];
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
					if(user_posts.length){				
						map_posts( shortables, user_posts );
						res.json(shortables);
					}
				});
			}
			else{
				res.json(shortables);
			}
		});

	});

	app.get("/api/shortables/owner", function(req, res){
		let condition = {};
		if(req.user){
			let condition = {
				UserId : req.user.id
			};
			const post_attr = ['id','title','content','rating', 'voted','published'];
			const user_attr = ['username','firstname','lastname','picture'];
			db.Post.findAll({
				attributes: post_attr,
				where: condition,
				order: [['createdAt', 'DESC']],
				include: [{ model: db.User, attributes: user_attr}]

			}).then(function(shortables) {
				res.json(shortables);
			});
		}
		else{
			res.status(401).send();
		}
	});

	app.get("/api/shortables/favorites", function(req, res){
		if(req.user){
			// const user_attr = ['username','firstname','lastname','picture'];
			db.UserPost.findAll({
				attributes: ['id','rated', 'PostId'],
				where: { 
					favorites : true,
					UserId : req.user.id
				},
				order: [['createdAt', 'DESC']]

			}).then(function(user_posts) {
				if(user_posts.length ){
					let ids_array = [];
					for(let i=0; i<user_posts.length; i++){
						ids_array.push(user_posts[i].PostId);
					}
					const user_attr = ['username','firstname','lastname','picture'];
					db.Post.findAll({
						attributes: ['id','title','content','rating'],
						where: { id : ids_array },
						order: [['updatedAt', 'DESC']],
						include: [{ model: db.User, attributes: user_attr}]
					}).then(function(shortables) {
						if(shortables.length){				
							map_posts( shortables, user_posts );
							res.json(shortables);
						}
					});
				}
				else{
					res.json(user_posts);
				}

			});
		}
		else{
			res.status(401).send();
		}
	});

	//get a single shortable
	app.get("/api/shortable/:id", function(req, res) {
		
		const post_attr = ['id','title','content','rating', 'voted','published'];
		const user_attr = ['username','firstname','lastname','picture'];
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
	
	app.get("/api/shortables/authors", function(req, res){
		const user_attr = ['id','username','picture'];
		db.User.findAll({
			attributes: user_attr,
			where: { type: 'user' },
			order: [['createdAt', 'DESC']]
		}).then(function(authors) {
			res.json(authors);
		});
	});

	//---------- POST and PUT ---------------------//
	
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
		db.UserPost.findOne({
			attributes: ['id', 'favorites', 'rated'],
			where: { 
				PostId: req.params.id, 
				UserId: req.user.id 
			}
		}).then(function(user_posts){
			if( user_posts.length ){
				//some record for user-post was found, so update it
				let user_post_id = user_posts[0].id;

				db.UserPost.update(
					{ rated: 1 },
					{ where: { id: user_post_id } }
				).then(function(shortable) {
					res.json(shortable);
				});
			}
			else{
				//no record found, so add new record
				let user_post = {
					UserId : req.user.id,
					PostId : req.params.id,
					voted  : 1,
					favorites : false
				};
				db.UserPost.create(
					user_post,
				).then(function(shortable) {
					res.json(shortable);
				});
			}
		});
	});

	//adding to (or deleting from) fav list
	app.put("/api/shortable/favorites/:action", function(req, res){
		//action: add or delete
		db.UserPost.findOne({
			attributes: ['id', 'favorites', 'rated'],
			where: { 
				PostId: req.params.id, 
				UserId: req.user.id 
			}
		}).then(function(user_posts){
			if( user_posts.length ){
				//some record for user-post was found, so update it
				let user_post_id = user_posts[0].id;
				let new_val = (req.params.action === 'add')? true : false;
				db.UserPost.update(
					{ favorites: new_val },
					{ where: { id: user_post_id } }
				).then(function(shortable) {
					res.json(shortable);
				});
			}
			else{
				//no record found, so add new record
				let user_post = {
					UserId : req.user.id,
					PostId : req.params.id,
					voted  : 1,
					favorites : false
				};
				db.UserPost.create(
					user_post,
				).then(function(shortable) {
					res.json(shortable);
				});
			}
		});
	});

	app.get("*", function(req, res) {
		res.redirect('/shortables/all');
		// res.sendFile(path.join(__dirname, "../public/home.html"));
	});
};
