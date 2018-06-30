import app from '../app';
import { getTokens, makeGraphQlQuery } from './utils';
import { groups } from './queries';

describe('GraphQL Groups', () => {
  let tokens;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('Get Groups', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.getGroups,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('groups');
    expect(data.groups).toHaveLength(10);
    expect(data.groups[0]).toHaveProperty('id');
    expect(data.groups[0]).toHaveProperty('name');
    expect(data.groups[0].id).toBe(10);
    expect(data.groups[0].name).toBe('Пальто');
  });
});
