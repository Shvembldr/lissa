export default (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    type: DataTypes.INTEGER,
  });

  Group.associate = (models) => {
    Group.hasMany(models.Card, {
      foreignKey: 'groupId',
    });
  };

  return Group;
};
