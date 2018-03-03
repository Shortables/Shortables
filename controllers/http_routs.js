module.exports = function(app) {

	app.get('/', function(req, res){
        posts = ['first post', 'second post', 'third post']
        res.render('index', { user : req.user, posts : posts });
	    // res.render('index', { user : req.user });
	});

	app.get("/new-shortable", function(req, res) {
		res.render('new_post', { user : req.user });
	});

	app.get('/register', (req, res) => {
		res.render('register', { user : req.user });
	});

	app.get('/login', (req, res) => {
		// res.render('login', { user : req.user, error : req.flash('error')});
		res.render('login', { user : req.user });
		// res.render('login');
	});
};