import 'babel-polyfill';
import models from '../../src/models';
import randomFromArr from '../../src/utils/randomFromArr';

module.exports = {
  async up(queryInterface) {
    const products = await models.Product.findAll({ raw: true });
    const cards = await models.Card.findAll();
    const cardOperations = await cards.map(async card =>
      card.getOperations({ raw: true })
    );
    const resolvedCardOperations = await Promise.all(cardOperations);
    const workers = await models.Worker.findAll({ raw: true });
    const workerIds = workers.map(worker => worker.id);

    const allOperations = products.reduce((acc, product, index) => {
      const productOperations = resolvedCardOperations[index % 100].map(op => ({
        code: op.code,
        price: op.price,
        productId: product.id,
        workerId: randomFromArr(workerIds),
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      return [...acc, ...productOperations];
    }, []);

    return queryInterface.bulkInsert('Operations', allOperations, {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Operations', null, {});
  }
};
