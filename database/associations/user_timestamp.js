module.exports = (db) => {
  const {
    User,
    Timestamp,
  } = db;

  User.Timestamps = User.hasMany(Timestamp, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });

  Timestamp.User = Timestamp.belongsTo(User);
};
