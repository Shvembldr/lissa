import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    workers: isAuthenticatedResolver.createResolver(() => models.Worker.findAll()),
  },

  Mutation: {
    createWorker: isAuthenticatedResolver.createResolver((obj, { input }) => models.Worker.create(input)),

    updateWorker: isAuthenticatedResolver.createResolver(async (obj, { id, input }) => {
      const Worker = await models.Worker.findById(id);
      return Worker.update(input);
    }),

    removeWorker: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const Worker = await models.Worker.findById(id);
      return Worker.destroy();
    }),

    removeWorkers: isAuthenticatedResolver.createResolver(async (obj, { ids }) => {
      const workers = ids.map(id => models.Worker.findById(id));
      const resolvedWorkers = await Promise.all(workers);
      const workersToDestroy = resolvedWorkers.map(worker => worker.destroy());
      await Promise.all(workersToDestroy);
      return ids;
    }),
  },

  Worker: {
    operations(worker) {
      return worker.getOperations();
    },
  },
});
