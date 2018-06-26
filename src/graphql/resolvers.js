import { combineResolvers } from 'apollo-resolvers';

import User from './user/resolvers';
import Card from './card/resolvers';
import Group from './group/resolvers';
import Operation from './operation/resolvers';
import Worker from './worker/resolvers';
import Product from './product/resolvers';
import Customer from './customer/resolvers';

const resolvers = combineResolvers([
  User(),
  Card(),
  Group(),
  Operation(),
  Worker(),
  Product(),
  Customer()
]);

export default resolvers;
