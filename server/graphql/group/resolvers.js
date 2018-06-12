import { isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    groups: isAuthenticatedResolver.createResolver(() =>
      models.Group.findAll({
        order: [['id', 'ASC']],
      }),
    ),
  },

  Mutation: {
    createGroup: isAuthenticatedResolver.createResolver((obj, { input }) => {
      return models.Group.create(input);
    }),

    updateGroup: isAuthenticatedResolver.createResolver(async (obj, { id, input }) => {
      const group = await models.Group.findById(id);
      return group.update(input);
    }),

    removeGroup: isAuthenticatedResolver.createResolver(async (obj, { id }) => {
      const group = await models.Group.findById(id);
      return group.destroy();
    }),

    removeGroups: isAuthenticatedResolver.createResolver(async (obj, { ids }) => {
      const groups = ids.map(id => models.Group.findById(id));
      const resolvedGroups = await Promise.all(groups);
      const groupsToDestroy = resolvedGroups.map(group => group.destroy());
      await Promise.all(groupsToDestroy);
      return ids;
    }),
  },
});
