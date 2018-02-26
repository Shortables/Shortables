var passportLocalSequelize = require('passport-local-sequelize');

module.exports = function(sequelize, DataTypes){
	var User = passportLocalSequelize.defineUser(sequelize, {
		email: {
			type: DataTypes.STRING,
			validate: {	isEmail: true }
		},
		firstname: {
			type: DataTypes.STRING,
			defaultValue: null
		},
		lastname: {
			type: DataTypes.STRING,
			defaultValue: null
		},
		picture: {
			type: DataTypes.STRING,
			defaultValue: null
		}
	});

	// let User = sequelize.define("User",{
	// 	username: {
	// 		type: DataTypes.STRING,
	// 		allowNull: false,
	// 		validate: {
	// 			is: /^[a-zA-Z][a-zA-Z0-9_]*$/i,
	// 			len:[1,20]
	// 		}
	// 	},
	// 	email: {
	// 		type: DataTypes.STRING,
	// 		allowNull: false,
	// 		validate: {	isEmail: true }
	// 	},
	// 	password:  {
	// 		type: DataTypes.STRING,
	// 		allowNull: false,
	// 		validate: {
	// 			is: /^[a-zA-Z][a-zA-Z0-9_]*$/i,
	// 			len:[1,20]
	// 		}			
	// 	},
	// 	picture: {
	// 		type: DataTypes.STRING,
	// 		defaultValue: null
	// 	}
	// });

	return User;
}
