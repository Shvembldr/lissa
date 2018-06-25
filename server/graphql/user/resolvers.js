import {
  baseResolver, isAdminResolver,
  isAuthenticatedResolver,
} from '../baseResolver';
import { encrypt } from '../../utils/encrypt';
import { tryLogin } from '../../auth';
import models from '../../models';

export default () => ({
  Query: {
    me: isAuthenticatedResolver.createResolver((obj, args, { user }) =>
      models.User.findById(user.id)),
    users: isAdminResolver.createResolver(() => models.User.findAll()),
  },

  Mutation: {
    register: baseResolver.createResolver(async (obj, { input }) => {
      input.password = await encrypt.hash(input.password);
      return models.User.create(input);
    }),

    login: baseResolver.createResolver(async (obj, { input: { email, password } }) =>
      tryLogin(email, password)),

    updateUser: isAdminResolver.createResolver(async (obj, { id, input }) => {
      const user = await models.User.findById(id);
      input.password = await encrypt.hash(input.password);
      return user.update(input);
    }),

    removeUser: isAdminResolver.createResolver(async (obj, { id }) => {
      const user = await models.User.findById(id);
      return user.destroy();
    }),
  },
});
