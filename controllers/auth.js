var passport	= require('passport');
var db			= require("../models");

module.exports = function(app) {

	app.post('/register', function(req, res, next) {
		db.User.register(
			req.body['username'], 
			req.body['password'], 
			function (err, registeredUser) {
				console.log("***"+err);

				if (err) {
					console.log(err.class);
					// return res.status(404).end();
					return res.render("register", { title: "Invalid username. Try again.", users:null});
					// return res.render("register", { title: "Sorry. That username already exists. Try again.", users:null});
				};

				// console.log(registeredUser+"===");
				registeredUser.email = req.body['email'];
				registeredUser.firstname = req.body['firstname'] || null;
				registeredUser.lastname = req.body['lastname'] || null;

				registeredUser.save();

				passport.authenticate('local')(req, res, function () {
					res.redirect('/');
				});
			}
		);
	});

	// app.post('/login', passport.authenticate('local'), function(req, res) {
	//     res.redirect('/');
	// });
	// app.post('/login', 
	// 	passport.authenticate('local', { 
	// 			failureRedirect: '/login', 
	// 			failureFlash: true//"Incorrect username/password" 
	// 	}), 
	// 	function(req, res, next){
	//     	req.session.save( function(err) {
	//         	if (err) {
	//             	return next(err);
	//         	}
	//         	res.redirect('/');
	//     	});
	// });

	app.post('/login', function(req, res, next) {
		passport.authenticate('local', 
			function(err, user, info) {
				if (err) {
					return next(err); 
				}
				if (!user) {
					console.log("===/login : no user or wrong pass");
					return res.redirect('/'); 
				}
				req.logIn(user, function(err) {
					if (err) {
						return next(err); 
					}
					return res.redirect('/');
				});
			}
		)(req, res, next);
	});

	app.get('/logout', (req, res, next) => {
		req.logout();
		req.session.destroy((err) => {
		// req.session.save((err) => {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	});

};
