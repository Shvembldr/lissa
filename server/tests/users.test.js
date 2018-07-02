import app from '../app';
import { makeGraphQlQuery } from './utils';
import { user } from './queries';
import { USER_ROLE } from '../constants';

describe('GraphQL User', () => {
  const tokens = [];
  const admin = {
    email: 'admin@admin.com',
    password: 'admin',
  };

  test('login', async () => {
    const response = await makeGraphQlQuery({
      app,
      query: user.login,
      variables: {
        input: admin,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('login');
    expect(data.login).toHaveProperty('token');
    expect(data.login).toHaveProperty('refreshToken');
    tokens.push(data.login.token);
    tokens.push(data.login.refreshToken);
  });

  test('getUser', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens,
      query: user.getUser,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('me');
    expect(data.me).toHaveProperty('name');
    expect(data.me).toHaveProperty('role');
    expect(data.me).toHaveProperty('email');
    expect(data.me.name).toBe('admin');
    expect(data.me.email).toBe(admin.email);
    expect(data.me.role).toBe(USER_ROLE.ADMIN);
  });
});
