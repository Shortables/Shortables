const db = require("../models");

module.exports = function(app) {

    app.get('/', (req, res) => {
        posts = ['first post', 'second post', 'third post']
        res.render('index', { user : req.user, posts : posts });
    });

    app.get('/login', (req, res) => {
        res.render('login', { user : req.user });
    });

    app.get('/register', (req, res) => {
        res.render('register', { user : req.user });
    });

    app.get('/upload', (req, res) => {
        res.render('upload', { user : req.user });
    });

    app.get("/shortables/all", function(req, res) {
//+include UserPost if authorised for voting and subscribing buttons
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: ['id','title','content','rating','voted'],
			where: { published: true },
			limit: 100,
			order: [['updatedAt', 'DESC']],
			include: [{ model: db.User, attributes: user_attr}]

		}).then(function(shortables) {
			res.json(shortables);
		});
	});

	app.get("/shortables/popular/:time?", function(req, res) {

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
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: ['id','title','content','rating','voted'],
			where: query,
			limit: 100,
			order: ['rating', 'updatedAt','DESC'],
			include: [{model: db.User, attributes: user_attr}]
			// group: [db.Sequelize.fn('date_trunc', 'day', db.Sequelize.col('createdAt'))]
		}).then(function(shortables) {
			res.json(shortables);
		});
	});

	app.get("/shortables/author/:name", function(req, res){
		let condition = {};
		if( !req.user || req.user.username !== req.params.name ){
			condition.published = true;
		}
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findAll({
			attributes: ['id','title','content','rating','voted','published'],
			where: condition,
			// limit: 100,
			order: [['updatedAt', 'DESC']],
			include: [{ model: db.User, attributes: user_attr}]

		}).then(function(shortables) {
			res.json(shortables);
		});

	});

	//get a single shortable
	app.get("/shortables/:id", function(req, res) {
		
		let user_attr = ['username','firstname','lastname','picture'];
		db.Post.findOne({
			where: {
				id: req.params.id
			},
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
	app.get("/new", function(req, res) {
		res.render('new_post');
	});

	app.post("/add_post", function(req, res) {
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

	// updating post
	app.get("/update_post/:id", function(req, res){
		//find One and return if authorized
	});

	app.put("/update_post/:id", function(req, res) {
		// title, content, published flag
		if(req.user && req.user.id === req.body.UserId)
		db.Post.update(
			req.body,
			{ id: req.body.id }
			// { where: { id: req.body.id } }
		).then(function(shortable) {
			res.json(shortable);
		});
	});
	
	// voting
	app.put("/shortables/vote/:id", function(req, res){
		//vote for post
		//check 
	});

	app.get("*", function(req, res) {
		res.redirect('/shortables/all');
		// res.sendFile(path.join(__dirname, "../public/home.html"));
	});
};
