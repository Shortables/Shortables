module.exports = function(sequelize, DataTypes){
	var Post = sequelize.define("Post", {
		title : {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len:{
					args: [2,100], 
					msg: "Title must be between 2 and 100 characters in length."
				}
			}
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {	
				len: {
					args:[10], 
					msg: "Text must be at least 10 characters in length." 
				}
			}
		},
		rating: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		voted: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	});

	Post.associate = function(models) {
		// Post should belong to User (foreugn key consstraint)
		Post.belongsTo(models.User, {
			foreignKey: {
				allowNull: false
			}
		});
	};

	return Post;
}
