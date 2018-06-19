import 'babel-polyfill';
import randomFromArr from '../../server/utils/randomFromArr';

module.exports = {
  async up(queryInterface) {
    const groupsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return queryInterface.bulkInsert(
      'Cards',
      new Array(100)
        .fill(null)
        .map(() => ({
          vendorCode: Math.random().toString().substr(2, 8),
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

