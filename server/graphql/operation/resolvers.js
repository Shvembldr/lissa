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

    updateOperation: isAuthenticatedResolver.createResolver(async (obj, { id, input, workerId }) => {
      const operation = await models.Operation.findById(id);
      const worker = await models.Worker.findById(workerId);
      await operation.update(input);
      await operation.setWorker(worker);
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
  },
});
