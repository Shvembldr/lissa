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
          name: 'Жакеты',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Кардиганы',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Рубашки',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Юбки',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Брюки',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Сарафаны',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Шаровары',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Пальто',
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
