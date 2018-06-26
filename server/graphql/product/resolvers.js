import { isAdminResolver, isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    products: isAuthenticatedResolver.createResolver(async (obj, {
      match, filters, dates, limit, offset,
    }) => {
      const groups = await models.Group.findAll({ raw: true });
      const groupIds = groups.map(group => group.id);
      const date = new Date();
      return models.Product.findAndCountAll({
        order: [['id', 'DESC']],
        where: {
          vendorCode: {
            $like: `${match}%`,
          },
          groupId: {
            $any: filters && filters.length > 0 ? filters.map(id => parseInt(id, 10)) : groupIds,
          },
          date: {
            $between: dates || ['1970-01-01T00:00:00+00:00', date.toISOString()],
          },
        },
        limit: limit || 8,
        offset: offset || 0,
      });
    }),

    productsReport: isAdminResolver.createResolver(async (obj, { dateRange }) => {
      const products = await models.Product.findAll({
        order: [['id', 'DESC']],
        where: {
          date: {
            $between: dateRange,
          },
        },
        include: {
          model: models.Operation,
        },
      });

      const productsHash = products.reduce((acc, product) => {
        const { vendorCode, count, Operations } = product.dataValues;
        if (!acc.vendorCode) {
          acc[vendorCode] = {
            count: 0,
            price: Operations.reduce((sum, op) => sum + op.dataValues.price, 0),
          };
        }

        acc[vendorCode].count += count;
        acc[vendorCode].sum = acc[vendorCode].count * acc[vendorCode].price;

        return acc;
      }, {});

      return {
        report: Object.keys(productsHash).map(key => ({
          vendorCode: key,
          count: productsHash[key].count,
          price: productsHash[key].price,
          sum: productsHash[key].sum,
        })),
      };
    }),
  },

  Mutation: {
    createProduct: isAuthenticatedResolver.createResolver(async (obj, { input }) => {
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
      await product.setCustomer(input.customerId);
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
      await product.setCustomer(input.customerId);

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

    customer(product) {
      return product.getCustomer();
    },
  },
});
