import 'babel-polyfill';
import models from '../../server/models';
import randomFromArr from '../../server/utils/randomFromArr';
import randomInt from '../../server/utils/randomInt';
import randomDate from '../../server/utils/randomDate';

module.exports = {
  async up(queryInterface) {
    const cards = await models.Card.findAll({ raw: true });
    const sizes = [34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56];
    const customers = await models.Customer.findAll({ raw: true });
    const customersIds = customers.map(customer => customer.id);

    return queryInterface.bulkInsert(
      'Products',
      new Array(500).fill(null).map((val, index) => ({
        vendorCode: cards[index % 100].vendorCode,
        groupId: cards[index % 100].groupId,
        customerId: randomFromArr(customersIds),
        size: randomFromArr(sizes),
        count: randomInt(1, 24),
        date: randomDate(new Date(2018, 1, 1), new Date()),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {},
    );
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Products', null, {});
  },
};
