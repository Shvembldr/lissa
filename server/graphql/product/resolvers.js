import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    products: isAuthenticatedResolver.createResolver(() =>
      models.Product.findAll()),
  },

  Mutation: {
    createProduct: isAuthenticatedResolver
      .createResolver(async (obj, { input }) => {
        const card = await models.Card.findById(input.cardId);
        const operations = await card.getOperations({ raw: true });
        const group = await card.getGroup();

        const product = await models.Product.create({
          vendorCode: card.dataValues.vendorCode,
          size: input.size,
          count: input.count,
          date: input.date,
        });

        await models.Operation.bulkCreate(operations.map(op => ({
          code: op.code,
          price: op.price,
          productId: product.dataValues.id,
        })));

        await product.setGroup(group);
        return product;
      }),

    updateProduct: isAuthenticatedResolver.createResolver(async (obj, { id, input }) => {
      const product = await models.Product.findById(id);
      return product.update(input);
    }),

    removeProduct: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const product = await models.Product.findById(id);
      return product.destroy();
    }),
  },

  Product: {
    operations(product) {
      return product.getOperations();
    },

    group(product) {
      return product.getGroup();
    },
  },
});
