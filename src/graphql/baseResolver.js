import { createResolver } from 'apollo-resolvers';
// import { isInstance } from 'apollo-errors';
import { AuthenticationRequiredError, ForbiddenError } from './errors';
import { USER_ROLE } from '../constants';

export const baseResolver = createResolver(
  // incoming requests will pass through this resolver like a no-op
  null,
  /*
    Only mask outgoing errors that aren't already apollo-errors,
    such as ORM errors etc
  */
  // (root, args, context, error) =>
  // isInstance(error) ? error : new UnknownError(),
);

export const isAuthenticatedResolver = createResolver(
  async (parent, args, { user }) => {
    if (!user) throw new AuthenticationRequiredError();
  },
);

export const isAdminResolver = isAuthenticatedResolver.createResolver(
  (parent, args, { user }) => {
    if (!user || user.role !== USER_ROLE.ADMIN) throw new ForbiddenError();
  },
);
