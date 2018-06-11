import 'babel-polyfill';
import models from '../../server/models';

module.exports = {
  async up(queryInterface) {
    const groups = await models.Group.findAll({ raw: true });
    return queryInterface.bulkInsert(
      'Cards',
      new Array(5)
        .fill(null)
        .map((val, index) => ({
          vendorCode: `FFF-${index}`,
          groupId: groups[index].id,
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

