import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    groups: isAuthenticatedResolver.createResolver(() =>
      models.Group.findAll()),
  },

  Mutation: {
    createGroup: isAuthenticatedResolver.createResolver((obj, { input }) => {
      return models.Group.create(input);
    }),

    updateGroup: isAuthenticatedResolver.createResolver(async (obj, { id, input }) => {
      const Group = await models.Group.findById(id);
      return Group.update(input);
    }),

    removeGroup: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const Group = await models.Group.findById(id);
      return Group.destroy();
    }),
  },
});
