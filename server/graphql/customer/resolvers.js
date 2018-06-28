import { isAdminResolver, isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    customers: isAuthenticatedResolver.createResolver(() => models.Customer.findAll({
      order: [['id', 'DESC']],
    })),
  },

  Mutation: {
    createCustomer: isAdminResolver.createResolver((obj, { input }) => models.Customer.create(input)),

    updateCustomer: isAdminResolver.createResolver(async (obj, { id, input }) => {
      const customer = await models.Customer.findById(id);
      return customer.update(input);
    }),

    removeCustomer: isAdminResolver.createResolver(async (obj, { id }) => {
      const customer = await models.Customer.findById(id);
      return customer.destroy();
    }),

    removeCustomers: isAdminResolver.createResolver(async (obj, { ids }) => {
      const customers = ids.map(id => models.Customer.findById(id));
      const resolvedCustomers = await Promise.all(customers);
      const customersToDestroy = resolvedCustomers.map(customer => customer.destroy());

      await Promise.all(customersToDestroy);
      return ids;
    }),
  },
});
