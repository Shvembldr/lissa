import 'babel-polyfill';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'Workers',
      new Array(10)
        .fill(null)
        .map((val, index) => ({
          code: index,
          name: `Василиса-${index}`,
          surname: 'Петрова',
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Workers', null, {});
  },
};

