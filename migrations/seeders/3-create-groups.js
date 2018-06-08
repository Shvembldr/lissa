import 'babel-polyfill';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'Groups',
      [
        {
          name: 'Платья',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Блузки',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Штаны',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Кепки',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Шорты',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Groups', null, {});
  },
};

