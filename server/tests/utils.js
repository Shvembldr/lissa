import request from 'supertest';
import { USER_ROLE } from '../constants';
import { createTokens } from '../auth';

const user = {
  id: 1,
  role: USER_ROLE.USER,
};

const admin = {
  id: 2,
  role: USER_ROLE.ADMIN,
};

export const getTokens = async () => {
  const adminTokens = await createTokens(admin);
  const userTokens = await createTokens(user);
  return {
    adminTokens,
    userTokens,
  };
};

export const makeGraphQlQuery = ({
  app, tokens, query, variables,
}) => request(app)
  .post('/graphql')
  .send({
    query,
    variables,
  })
  .set('x-token', tokens[0])
  .set('x-refresh-token', tokens[1])
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json');
