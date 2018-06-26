import { isAdminResolver, isAuthenticatedResolver } from '../baseResolver';
import models from '../../models';

export default () => ({
  Query: {
    groups: isAuthenticatedResolver.createResolver(() =>
      models.Group.findAll({
        order: [['id', 'DESC']]
      })
    )
  },

  Mutation: {
    createGroup: isAdminResolver.createResolver((obj, { input }) =>
      models.Group.create(input)
    ),

    updateGroup: isAdminResolver.createResolver(async (obj, { id, input }) => {
      const group = await models.Group.findById(id);
      return group.update(input);
    }),

    removeGroup: isAdminResolver.createResolver(async (obj, { id }) => {
      const group = await models.Group.findById(id);
      return group.destroy();
    }),

    removeGroups: isAdminResolver.createResolver(async (obj, { ids }) => {
      const groups = ids.map(id => models.Group.findById(id));
      const resolvedGroups = await Promise.all(groups);
      const groupsToDestroy = resolvedGroups.map(group => group.destroy());
      await Promise.all(groupsToDestroy);
      return ids;
    })
  }
});
