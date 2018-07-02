import { isAdminResolver, isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    workers: isAuthenticatedResolver.createResolver(() => models.Worker.findAll({
      order: [['id', 'DESC']],
    })),

    workersReport: isAuthenticatedResolver.createResolver(async (obj, { dateRange }) => models.Worker.findAll({
      include: {
        model: models.Operation,
        required: true,
        include: {
          model: models.Product,
          where: {
            date: {
              $between: dateRange,
            },
          },
        },
      },
      order: [['code', 'ASC'], [{ model: models.Operation }, 'id', 'ASC']],
    })),
  },

  Mutation: {
    createWorker: isAdminResolver.createResolver((obj, { input }) => models.Worker.create(input)),

    updateWorker: isAdminResolver.createResolver(async (obj, { id, input }) => {
      const Worker = await models.Worker.findById(id);
      return Worker.update(input);
    }),

    removeWorker: isAdminResolver.createResolver(async (obj, { id }) => {
      const Worker = await models.Worker.findById(id);
      return Worker.destroy();
    }),

    removeWorkers: isAdminResolver.createResolver(async (obj, { ids }) => {
      const workers = ids.map(id => models.Worker.findById(id));
      const resolvedWorkers = await Promise.all(workers);
      const workersToDestroy = resolvedWorkers.map(worker => worker.destroy());
      await Promise.all(workersToDestroy);
      return ids;
    }),
  },

  Worker: {
    operations(worker) {
      if (worker.dataValues.Operations) {
        return worker.dataValues.Operations;
      }
      return worker.getOperations({
        order: [['id', 'ASC']],
      });
    },
  },
});
