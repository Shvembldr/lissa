import { combineResolvers } from 'apollo-resolvers';

import User from './user/resolvers';

const resolvers = combineResolvers([
  User(),
]);

export default resolvers;
