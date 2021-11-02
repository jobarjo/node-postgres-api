const M = require('moment');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'BASIC',
      validate: {
        isIn: [['BASIC', 'ADMIN']],
      },
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
    tableName: 'users',
  });

  return User;
};
