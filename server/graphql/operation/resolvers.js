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
