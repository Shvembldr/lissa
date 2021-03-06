import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import resolvers from './resolvers';
import config from '../config';
import types from './typeDefs';

const { SECRET } = config;
const graphqlRouter = express.Router();
const graphiqlRouter = express.Router();

const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers,
});

graphqlRouter.use(
  graphqlExpress(req => ({
    schema,
    context: {
      SECRET,
      user: req.user,
    },
  })),
);

graphiqlRouter.use(graphiqlExpress({ endpointURL: '/graphql' }));

export { graphqlRouter };
export { graphiqlRouter };
