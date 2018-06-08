import 'babel-polyfill';
import models from '../../server/models';

module.exports = {
  async up(queryInterface) {
    const cards = await models.Card.findAll({ raw: true });
    const workers = await models.Worker.findAll({ raw: true });

    const allOperations = cards.reduce((acc, card) => {
      const operations = new Array(10).fill(null).map((op, i) => ({
        code: i,
        price: (i + 1) * 10,
        cardId: card.id,
        workerId: workers[i].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      return [...acc, ...operations];
    }, []);

    const result = queryInterface.bulkInsert('Operations', allOperations, {});



    return result;
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Operations', null, {});
  },
};

