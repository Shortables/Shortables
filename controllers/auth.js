var express		= require("express");
var passport	= require('passport');
var db			= require("../models");

var auth_router = express.Router();


auth_router.get('/register', (req, res) => {
    res.render('register', { });
});

auth_router.post('/register', function(req, res, next) {
  db.User.register(
  	req.body['username'], 
  	req.body['password'], 
  	function (err, registeredUser) {
  		console.log("***"+err);

		if (err) {
			console.log(err.class);
			return res.render("register", { title: "Sorry. That username already exists. Try again.", users:null});
		};

  		console.log(registeredUser+"===");
		registeredUser.email = req.body['email'];
		// registeredUser.firstname = req.body['firstname']||null;
		// registeredUser.lastname = req.body['lastname']||null;

    	registeredUser.save();

		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});
});

auth_router.get('/login', (req, res) => {
    // res.render('login', { user : req.user, error : req.flash('error')});
    res.render('login', { user : req.user });
    // res.render('login');
});

// auth_router.post('/login', passport.authenticate('local'), function(req, res) {
//     res.redirect('/');
// });
// router.post('/login', 
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

auth_router.post('/login', function(req, res, next) {
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

auth_router.get('/logout', (req, res, next) => {
	req.logout();
	req.session.destroy((err) => {
	// req.session.save((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

module.exports = auth_router;
