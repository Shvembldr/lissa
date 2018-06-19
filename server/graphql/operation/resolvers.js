import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Mutation: {
    createOperation: isAuthenticatedResolver.createResolver(async (obj, { input, workerId }) => {
      const operation = await models.Operation.create(input);
      const worker = await models.Worker.findById(workerId);
      await operation.setWorker(worker);
      return operation;
    }),

    updateOperation: isAuthenticatedResolver.createResolver(async (obj, { id, input }) => {
      const operation = await models.Operation.findById(id);
      if (input.workerCode) {
        const worker = await models.Worker.findOne({
          where: {
            code: input.workerCode,
          },
        });
        await operation.setWorker(worker);
        return operation;
      }

      const card = await operation.getCard({ raw: true });

      const products = await models.Product.findAll({
        where: {
          vendorCode: card.vendorCode,

        },
      });

      if (products) {
        const operations = products.map(product => product.getOperations({
          where: {
            code: input.code,
          },
        }));

        const resolvedOperations = await Promise.all(operations);

        const updateOperations = resolvedOperations.map(op => op[0].update({
          code: input.code,
          price: input.price,
        }));
        await Promise.all(updateOperations);
      }

      await operation.update({
        code: input.code,
        price: input.price,
      });
      return operation;
    }),

    removeOperation: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const operation = await models.Operation.findById(id);
      return operation.destroy();
    }),
  },

  Operation: {
    worker(operation) {
      return operation.getWorker();
    },

    card(operation) {
      return operation.getCard();
    },

    product(operation) {
      return operation.getProduct();
    },
  },
});
