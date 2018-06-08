export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Group.associate = (models) => {
    Group.hasMany(models.Card, {
      foreignKey: 'groupId',
    });
  };

  return Group;
};
