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
		type: {
			type: DataTypes.STRING,
			defaultValue: 'user'
		},
		picture: {
			type: DataTypes.STRING,
			defaultValue: null
		}
	});

	User.associate = function(models) {
	// Associating User with Posts
	// When User is deleted, also delete any associated Posts
		User.hasMany(models.Post, {
			onDelete: "cascade"
		});
	};

	return User;
}
