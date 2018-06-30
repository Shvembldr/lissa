import app from '../app';
import getTokens from './getTokens';
import { makeGraphQlQuery } from './utils';
import { user } from './queries';
import { USER_ROLE } from '../constants';

describe('GraphQL User', () => {
  let tokens;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('getUser', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: user.getUser,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('me');
    expect(data.me).toHaveProperty('name');
    expect(data.me).toHaveProperty('email');
    expect(data.me).toHaveProperty('role');
    expect(data.me.name).toBe('admin');
    expect(data.me.email).toBe('admin@admin.com');
    expect(data.me.role).toBe(USER_ROLE.ADMIN);
  });
});
