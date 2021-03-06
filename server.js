var express 		= require("express");
var session 		= require("express-session");
var db 				= require("./models");
var bodyParser 		= require("body-parser");
var cookieParser 	= require('cookie-parser');
var exphbs 			= require("express-handlebars");

var passport 		= require('passport');

var passportLocalSequelize = require('passport-local-sequelize');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//...
app.use(cookieParser());
app.use(session({ secret: 'super-secret' }));
 
app.use(passport.initialize());
app.use(passport.session());
 
// passport config
passport.use(db.User.createStrategy()); 
passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/http_routes.js")(app);
require("./controllers/auth.js")(app);
require("./controllers/shortables.js")(app);

db.sequelize.sync().then( function(){
	app.listen(PORT, function(){
		console.log("Listening on port %s", PORT);
	});
});