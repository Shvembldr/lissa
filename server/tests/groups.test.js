import faker from 'faker';
import app from '../app';
import { groups } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';
import { sequelize } from '../models/index';

describe('GraphQL Groups', () => {
  let tokens;
  let testGroupId;
  let testGroupName;
  let groupsCount;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  afterAll(async () => {
    sequelize.connectionManager.close();
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
    groupsCount = data.groups.length;
  });

  test('Create group', async () => {
    const groupName = faker.random.word();
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

  test('User can not create group', async () => {
    const groupName = faker.random.word();
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.userTokens,
      query: groups.createGroup,
      variables: {
        input: {
          name: groupName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('createGroup');
    expect(data.createGroup).toBe(null);
    expect(errors[0].message).toBe('You must be an admin to do this');
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
    const groupName = faker.random.word();
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

    const getGroupsResponse = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: groups.getGroups,
    });

    expect(getGroupsResponse.statusCode).toBe(200);
    expect(getGroupsResponse.body.data.groups).toHaveLength(groupsCount);
  });
});
