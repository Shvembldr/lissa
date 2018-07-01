import app from '../app';
import { getTokens, makeGraphQlQuery } from './utils';

describe('GraphQL User', () => {
  let tokens;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('getUsers', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: `{
        users{
          id
          name
        }
      }`,
    });

    expect(response.statusCode).toBe(200);
  });
});
