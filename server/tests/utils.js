import request from 'supertest';

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
