const { v4: uuidv4 } = require("uuid");

// Function to generate a random color
const getRandomColor = () => {
  const primaryColors = ["#1E90FF", "#FF4500"]; // Add more primary colors as needed
  const secondaryColors = ["#32CD32", "#FFD700"]; // Add more secondary colors as needed

  const allColors = [...primaryColors, ...secondaryColors];
  const randomIndex = Math.floor(Math.random() * allColors.length);
  return allColors[randomIndex];
};

module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define("Notes", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Automatically generate UUID for the id
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set to current date
    },
    notecolor: {
      type: DataTypes.STRING,
      defaultValue: getRandomColor, // Automatically generate random color
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Notes.associate = (models) => {
    Notes.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Notes;
};
