import app from '../app';
import { groups } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';
import randomString from '../utils/randomString';

describe('GraphQL Groups', () => {
  let tokens;
  let testGroupId;
  let testGroupName;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('Get groups', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.getGroups,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('groups');
    expect(data.groups[0]).toHaveProperty('id');
    expect(data.groups[0]).toHaveProperty('name');
  });

  test('Create group', async () => {
    const groupName = randomString();
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.createGroup,
      variables: {
        input: {
          name: groupName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('createGroup');
    expect(data.createGroup).toHaveProperty('id');
    expect(data.createGroup).toHaveProperty('name');
    expect(data.createGroup.name).toBe(groupName);
    testGroupId = data.createGroup.id;
    testGroupName = data.createGroup.name;
  });

  test('Can not create same group', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.createGroup,
      variables: {
        input: {
          name: testGroupName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('createGroup');
    expect(data.createGroup).toBe(null);
    expect(errors[0].message).toBe('Validation error');
  });

  test('Update group', async () => {
    const groupName = randomString();
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.updateGroup,
      variables: {
        id: testGroupId,
        input: {
          name: groupName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateGroup');
    expect(data.updateGroup).toHaveProperty('id');
    expect(data.updateGroup).toHaveProperty('name');
    expect(data.updateGroup.name).toBe(groupName);
  });

  test('Remove group', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.removeGroups,
      variables: {
        ids: [testGroupId],
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('removeGroups');
    expect(data.removeGroups).toHaveLength(1);
    expect(data.removeGroups).toContain(testGroupId);
  });
});
