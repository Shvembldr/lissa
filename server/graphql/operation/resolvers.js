import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';
import { NoWorkerError } from '../errors';

export default () => ({
  Mutation: {
    updateOperations: isAuthenticatedResolver.createResolver(async (obj, { input }) => {
      const ids = input.map(operation => operation.id);

      if (!input[0].price) {
        const workerCodes = input.map(operation => operation.workerCode);
        const workers = await models.Worker.findAll({
          where: {
            code: {
              $any: workerCodes,
            },
          },
        });

        const setWorkerOperations = input.map(async (data) => {
          const worker = workers.find(worker => worker.dataValues.code === data.workerCode);
          const operation = await models.Operation.findById(data.id);
          if (!worker) {
            throw new Error();
          } else {
            await operation.setWorker(worker);
          }
        });

        try {
          await Promise.all(setWorkerOperations);
          return models.Operation.findAll({
            where: {
              id: {
                $any: ids,
              },
            },
            order: [['code', 'ASC']],
          });
        } catch (e) {
          throw new NoWorkerError();
        }
      }

      const operations = await models.Operation.findAll({
        where: {
          id: {
            $any: ids,
          },
        },
      });

      const card = await operations[0].getCard({ raw: true });

      const cardVendorCodes = card.vendorCode;

      const products = await models.Product.findAll({
        where: {
          vendorCode: cardVendorCodes,
        },
      });

      if (products) {
        const productOperations = products.map(product => product.getOperations({ order: [['code', 'ASC']] }));

        const resolvedProductOperations = await Promise.all(productOperations);

        const updateOperations = resolvedProductOperations.map(ops => ops.forEach((operation, index) => operation.update({
          price: input[index].price,
        })));

        await Promise.all(updateOperations);
      }

      await operations.forEach(async (operation, index) => operation.update({
        price: input[index].price,
      }));

      return operations;
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
