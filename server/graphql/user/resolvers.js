import { baseResolver, isAdminResolver, isAuthenticatedResolver } from '../baseResolver';
import { encrypt } from '../../utils/encrypt';
import { tryLogin } from '../../auth';
import models from '../../models';

export default () => ({
  Query: {
    me: isAuthenticatedResolver.createResolver((obj, args, { user }) => models.User.findById(user.id)),
    users: isAdminResolver.createResolver(() => models.User.findAll()),
  },

  Mutation: {
    register: baseResolver.createResolver(async (obj, { input }) => {
      const passInput = {
        ...input,
        password: await encrypt.hash(input.password),
      };

      return models.User.create(passInput);
    }),

    login: baseResolver.createResolver(async (obj, { input: { email, password } }) => tryLogin(email, password)),

    updateUser: isAdminResolver.createResolver(async (obj, { id, input }) => {
      const user = await models.User.findById(id);
      const passInput = {
        ...input,
        password: await encrypt.hash(input.password),
      };
      return user.update(passInput);
    }),

    removeUser: isAdminResolver.createResolver(async (obj, { id }) => {
      const user = await models.User.findById(id);
      return user.destroy();
    }),
  },
});
