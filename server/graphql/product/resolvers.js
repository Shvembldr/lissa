import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    products: isAuthenticatedResolver.createResolver(() =>
      models.Product.findAll({
        order: [['id', 'ASC']],
      })),
  },

  Mutation: {
    createProduct: isAuthenticatedResolver
      .createResolver(async (obj, { input }) => {
        const card = await models.Card.findOne({
          where: {
            vendorCode: input.vendorCode,
          },
        });
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
      const card = await models.Card.findOne({
        where: {
          vendorCode: input.vendorCode,
        },
      });
      const operations = await card.getOperations({ raw: true });
      const group = await card.getGroup();

      const product = await models.Product.findById(id);

      if (product.dataValues.vendorCode !== input.vendorCode) {
        await models.Operation.destroy({
          where: {
            productId: product.dataValues.id,
          },
        });

        await models.Operation.bulkCreate(operations.map(op => ({
          code: op.code,
          price: op.price,
          productId: product.dataValues.id,
        })));
      }

      await product.update({
        vendorCode: card.dataValues.vendorCode,
        size: input.size,
        count: input.count,
        date: input.date,
      });

      await product.setGroup(group);

      return product;
    }),

    removeProduct: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const product = await models.Product.findById(id);
      return product.destroy();
    }),

    removeProducts: isAuthenticatedResolver.createResolver(async (obj, { ids }) => {
      const products = ids.map(id => models.Product.findById(id));
      const resolvedProducts = await Promise.all(products);
      const productsToDestroy = resolvedProducts.map(product => product.destroy());
      await Promise.all(productsToDestroy);
      return ids;
    }),
  },

  Product: {
    operations(product) {
      return product.getOperations({
        order: [['code', 'ASC']],
      });
    },

    group(product) {
      return product.getGroup();
    },
  },
});
