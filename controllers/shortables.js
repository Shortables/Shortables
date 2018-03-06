const db = require("../models");

const USER_ATTR = ['username','firstname','lastname','picture'];
const POST_ATTR = ['id','title','content','rating', 'createdAt', 'cover', 'published'];

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
		let post_obj = posts[i].toJSON();
		if(post_map[post_id]){
			post_obj.fav = post_map[post_id][0];
			post_obj.rated = post_map[post_id][1];
			post_obj.rated_val = (post_map[post_id][1]===1)? 1 :0;
		}
		else{
			post_obj.fav = false;
			post_obj.rated = 0;
		}
		posts[i] = post_obj;
	}
	return posts;
}

module.exports = function(app) {

	app.get("/shortables/all", function(req, res) {
		db.Post.findAll({
			attributes: POST_ATTR,
			where: { published: true },
			limit: 100,
			order: [['updatedAt', 'DESC']],
			include: [{ model: db.User, attributes: USER_ATTR}]

		}).then(function(shortables) {
			if( !req.user){
				res.render('shortables', { shortables: shortables });
			}
			else if( !shortables || !shortables.length){
				res.render('shortables', { user: req.user });
			}
			else{
				//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					if(user_posts.length){				
						let posts = map_posts( shortables, user_posts );
						res.render('shortables',{ 
							user : req.user,
							shortables: posts
						});
					}
					else{
						res.render('shortables',{ 
							user : req.user,
							shortables: shortables
						});						
					}
				});
			}
		});
	});

	app.get("/shortables/popular/:time?", function(req, res) {

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
		db.Post.findAll({
			attributes: POST_ATTR,
			where: query,
			limit: 100,
			order: [['rating','DESC'],['updatedAt', 'DESC']],
			include: [{model: db.User, attributes: USER_ATTR}]

		}).then(function(shortables) {
			if( !req.user){
				res.render('shortables', { shortables: shortables });
			}
			else if( !shortables || !shortables.length){
				res.render('shortables', {user: req.user});
			}
			else{
			// if(req.user && shortables.length ){
			//include UserPost if authorised (for voting and subscribing buttons)
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					if(user_posts.length){				
						let posts = map_posts( shortables, user_posts );
						// res.json(shortables);
						res.render('shortables',{ 
							user : req.user,
							shortables: posts
						});
					}
					else{
						res.render('shortables',{ 
							user : req.user,
							shortables: shortables
						});						
					}
				});
			}
		});
	});

	app.get("/api/shortables/author/:userId", function(req, res){
		let condition = {
			UserId : req.params.userId,
			published : true
		};
		db.Post.findAll({
			attributes: POST_ATTR,
			where: condition,
			order: [['updatedAt', 'DESC']],
			include: [{ model: db.User, attributes: USER_ATTR}]

		}).then(function(shortables) {
			if( !req.user){
				res.render('shortables', { shortables: shortables });
			}
			else if( !shortables || !shortables.length){
				res.render('shortables', {user: req.user});
			}
			else{
			// if(req.user && shortables.length ){
			//include UserPost if authorised for voting and subscribing buttons
				db.UserPost.findAll({
					attributes: ['favorites', 'rated', 'PostId'],
					where: { UserId: req.user.id }
				}).then(function(user_posts){
					if(user_posts.length){				
						let posts = map_posts( shortables, user_posts );
						// res.json(shortables);
						res.render('shortables',{ 
							user : req.user,
							shortables: posts
						});
					}
					else{
						res.render('shortables',{ 
							user : req.user,
							shortables: shortables
						});						
					}
				});
			}
		});

	});

	app.get("/shortables/owner", function(req, res){
		let condition = {};
		if(req.user){
			let condition = {
				UserId : req.user.id
			};
			db.Post.findAll({
				attributes: POST_ATTR,
				where: condition,
				order: [['createdAt', 'DESC']],
				include: [{ model: db.User, attributes: USER_ATTR}]

			}).then(function(shortables) {
				let author = req.user;
				author.owner = true;
				if(shortables && shortables.length){
					db.UserPost.findAll({
						attributes: ['id','rated', 'favorites', 'PostId'],
						where: { 
							UserId : req.user.id
						},
						order: [['createdAt', 'DESC']]

					}).then(function(user_posts){
						if(user_posts && user_posts.length){
							let posts = map_posts( shortables, user_posts );
							res.render('shortables',{ 
								user : author,
								shortables: posts
							});
						}
						else{
							res.render('shortables', {
								user : author,
								shortables: shortables
							});
						}
					});
				}
				else {
					res.render('shortables', { user: author });
				}
			});
		}
		else{
			res.status(401).send();
		}
	});

	app.get("/shortables/favorites", function(req, res){
		if(req.user){
			db.UserPost.findAll({
				attributes: ['id','rated', 'favorites', 'PostId'],
				where: { 
					favorites : true,
					UserId : req.user.id
				},
				order: [['createdAt', 'DESC']]

			}).then(function(user_posts) {
				if( !user_posts || !user_posts.length){
					res.render('shortables', { user: req.user });
				}
				else{
				// if(user_posts.length ){
					let ids_array = [];
					for(let i=0; i<user_posts.length; i++){
						ids_array.push(user_posts[i].PostId);
					}
					db.Post.findAll({
						attributes: POST_ATTR,
						where: { id : ids_array },
						order: [['createdAt', 'DESC']],
						include: [{ model: db.User, attributes: USER_ATTR}]
					
					}).then(function(shortables) {
						let posts = map_posts( shortables, user_posts );
						res.render('shortables',{ 
							user : req.user,
							shortables: posts
						});
					});
				}
			});
		}
		else{
			res.render('shortables',{ msg : "not authorized" });
			// res.status(401).send();
		}
	});

	//get a single shortable
	app.get("/api/shortable/:id", function(req, res) {
		
		db.Post.findOne({
			attributes: POST_ATTR,
			where: { id: req.params.id },
			include: [{ model: db.User, attributes: USER_ATTR}]

		}).then(function(shortable) {
			if( shortable && (shortable.published === true || 
			(req.user && req.user.id === shortable.UserId))){
				res.json(shortable);
			}
			else {
				res.status(404).send({});
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
			// console.log(req.body);
			post.UserId = req.user.id;
			db.Post.create(post).then(function(result) {
				res.json({ id: result.insertId });
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
	app.put("/api/shortable/publish/:id", function(req, res){
		db.Post.update(
			{ published: true },
			{ where: { id: req.params.id } }
		).then(function(result) {
			res.status(200).send();
		});
	});
	app.put("/api/shortable/unpublish/:id", function(req, res){
		db.Post.update(
			{ published: false },
			{ where: { id: req.params.id } }
		).then(function(result) {
			res.status(200).send();
		});
	});
	// voting
	app.put("/api/shortable/vote/:id", function(req, res){
		//vote for post (id)
		let rating_str = 'rating';
		let rating_val = 0;
		if(req.body.vote === 'up'){
			rating_str += ' +1';
			rating_val = 1;
		}
		else if (req.body.vote === 'down'){
			rating_str += ' -1';
			rating_val = 2;
		}
		else rating_str += ' +0';

		db.Post.update({ 
			rating: db.sequelize.literal(rating_str),
			voted: db.sequelize.literal('voted +1')
		},
		{   where: { id: req.params.id } }

		).then(function(shortable) {

			db.UserPost.findOne({
				attributes: ['id', 'favorites', 'rated'],
				where: { 
					PostId: req.params.id, 
					UserId: req.user.id 
				}
			}).then(function(up_result){
				if( up_result !==null ) {
					//some record for user-post was found, so update it
					let user_post_id = up_result.id;
					//rated 1 is for add, 2 for down
					db.UserPost.update(
						{ rated: rating_val },
						{ where: { id: user_post_id } }
					).then(function(result) {
						res.status(200).send();
					});
				}
				else{
					//no record found, so add new record
					let user_post = {
						UserId : req.user.id,
						PostId : req.params.id,
						rated  : rating_val,
						favorites : false
					};
					db.UserPost.create(
						user_post,
					).then(function(shortable) {
						res.status(200).send();
					});
				}
			});
		});
	});

	//adding to (or deleting from) fav list
	app.put("/api/shortable/favorites/:id", function(req, res){
		//action: add or delete
		let new_val = (req.body.action === 'add')? true : false;
		db.UserPost.findOne({
			attributes: ['id', 'favorites', 'rated'],
			where: { 
				PostId: req.params.id, 
				UserId: req.user.id 
			}
		}).then(function(up_result){
			if( up_result !== null ){
				//some record for user-post was found, so update it
				db.UserPost.update(
					{ favorites: new_val },
					{ where: { id: up_result.id } }
				).then(function(result) {
					res.status(200).send();
				});
			}
			else{
				//no record found, so add new record
				let user_post = {
					UserId : req.user.id,
					PostId : req.params.id,
					voted  : 0,
					favorites : new_val
				};
				db.UserPost.create(
					user_post,
				).then(function(result) {
					res.status(200).send();
				});
			}
		});
	});

	app.get("*", function(req, res) {
		res.redirect('/shortables/all');
	});
};
