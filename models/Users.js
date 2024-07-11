module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Notes, {
      foreignKey: "userId", // Specify the foreign key
      onDelete: "CASCADE",
    });
  };

  return Users;
};
