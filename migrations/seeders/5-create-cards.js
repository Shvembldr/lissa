import 'babel-polyfill';
import randomFromArr from '../../server/utils/randomFromArr';
import models from '../../server/models';

module.exports = {
  async up(queryInterface) {
    const groups = await models.Group.findAll({ raw: true });
    const groupsIds = groups.map(group => group.id);

    return queryInterface.bulkInsert(
      'Cards',
      new Array(100).fill(null).map(() => ({
        vendorCode: Math.random()
          .toString()
          .substr(2, 8),
        groupId: randomFromArr(groupsIds),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Cards', null, {});
  },
};
