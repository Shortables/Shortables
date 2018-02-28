module.exports = function(sequelize, DataTypes){
	var UserPost = sequelize.define("UserPost", {
		favorites: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		rated: {
			type: DataTypes.INTEGER,
			defaultValue: false
		}
	});
	UserPost.associate = function(models) {
		UserPost.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		});
		UserPost.belongsTo(models.Post, { 
			foreignKey: {
				allowNull: false
			}
		});
	};

	return UserPost;
}