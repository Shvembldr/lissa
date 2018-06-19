import 'babel-polyfill';
import models from '../../server/models';
import randomFromArr from '../../server/utils/randomFromArr';

module.exports = {
  async up(queryInterface) {
    const products = await models.Product.findAll({ raw: true });
    const cards = await models.Card.findAll();
    const cardOperations = await cards.map(async card => card.getOperations({ raw: true }));
    const resolvedCardOperations = await Promise.all(cardOperations);
    const workerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const allOperations = products.reduce((acc, product, index) => {
      const productOperations = resolvedCardOperations[index % 100].map(op => ({
        code: op.code,
        price: op.price,
        productId: product.id,
        workerId: randomFromArr(workerIds),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      return [...acc, ...productOperations];
    }, []);

    return queryInterface.bulkInsert('Operations', allOperations, {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Operations', null, {});
  },
};

