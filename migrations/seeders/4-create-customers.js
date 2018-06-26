import 'babel-polyfill';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'Customers',
      [
        {
          name: 'Longestique',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Yellow Cat',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Gucci',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Prada',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Marc Jacobs',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Vivienne Westwood',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Aldaris',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'IBM',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Nvidia',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Институт стоматологии',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Customers', null, {});
  },
};

