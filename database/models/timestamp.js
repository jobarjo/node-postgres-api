const M = require('moment');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Timestamp = sequelize.define('timestamp', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gmtDiff: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return M(this.getDataValue('createdAt'), 'DD/MM/YYYY h:mm:ss').unix();
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return M(this.getDataValue('updatedAt'), 'DD/MM/YYYY h:mm:ss').unix();
      },
    },
  }, {
    tableName: 'timestamps',
  });

  return Timestamp;
};
