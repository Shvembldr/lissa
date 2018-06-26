import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';
import { NoWorkerError } from '../errors';

export default () => ({
  Mutation: {
    createOperation: isAuthenticatedResolver.createResolver(
      async (obj, { input, workerId }) => {
        const operation = await models.Operation.create(input);
        const worker = await models.Worker.findById(workerId);
        await operation.setWorker(worker);
        return operation;
      }
    ),

    updateOperations: isAuthenticatedResolver.createResolver(
      async (obj, { input }) => {
        const ids = input.map(operation => operation.id);
        const operations = await models.Operation.findAll({
          where: {
            id: {
              $any: ids
            }
          }
        });

        if (input[0].workerCode) {
          const workerCodes = input.map(operation => operation.workerCode);

          const workers = await models.Worker.findAll({
            where: {
              code: {
                $any: workerCodes
              }
            }
          });

          const setWorkerOperations = operations.map(
            async (operation, index) => {
              const worker = workers.find(
                w => w.dataValues.id === workerCodes[index]
              );
              if (!worker) {
                throw new Error();
              } else {
                await operation.setWorker(worker);
              }
            }
          );

          try {
            await Promise.all(setWorkerOperations);
            return operations;
          } catch (e) {
            throw new NoWorkerError();
          }
        }

        const cards = operations.map(operation =>
          operation.getCard({ raw: true })
        );

        const resolvedCards = await Promise.all(cards);

        const cardVendorCodes = resolvedCards.map(card => card.vendorCode);

        const products = await models.Product.findAll({
          where: {
            vendorCode: {
              $any: cardVendorCodes
            }
          }
        });

        if (products) {
          const productOperations = products.map(product =>
            product.getOperations()
          );

          const resolvedproductOperations = await Promise.all(
            productOperations
          );

          const updateOperations = resolvedproductOperations.map(ops =>
            ops.forEach((operation, index) =>
              operation.update({
                price: input[index].price
              })
            )
          );
          await Promise.all(updateOperations);
        }

        await operations.forEach(async (operation, index) =>
          operation.update({
            price: input[index].price
          })
        );

        return operations;
      }
    ),

    removeOperation: isAuthenticatedResolver.createResolver(
      async (obj, { id }) => {
        const operation = await models.Operation.findById(id);
        return operation.destroy();
      }
    )
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
    }
  }
});
