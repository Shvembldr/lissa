import 'babel-polyfill';
import models from '../../src/models';
import randomInt from '../../src/utils/randomInt';

module.exports = {
  async up(queryInterface) {
    const cards = await models.Card.findAll({ raw: true });

    const allOperations = cards.reduce((acc, card) => {
      const operations = new Array(randomInt(1, 12))
        .fill(null)
        .map((op, i) => ({
          code: i + 1,
          price: randomInt(1, 24) * 9,
          cardId: card.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
      return [...acc, ...operations];
    }, []);

    return queryInterface.bulkInsert('Operations', allOperations, {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Operations', null, {});
  }
};
