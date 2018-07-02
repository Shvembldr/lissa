import faker from 'faker';
import moment from 'moment/moment';
import app from '../app';
import { workers } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';

describe('GraphQL Workers', () => {
  let tokens;
  let testWorkerId;
  let testWorker;
  let workersCount;
  const now = new Date();
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('Get workers', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.getWorkers,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('workers');
    expect(data.workers[0]).toHaveProperty('id');
    expect(data.workers[0]).toHaveProperty('code');
    expect(data.workers[0]).toHaveProperty('name');
    expect(data.workers[0]).toHaveProperty('surname');
    workersCount = data.workers.length;
  });

  test('Get workers report', async () => {
    const startDate = moment(now).subtract(1, 'month');
    const endDate = moment(now);
    const dateRange = [startDate.toISOString(), endDate.toISOString()];
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.getWorkersReport,
      variables: {
        dateRange,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('workersReport');
    expect(data.workersReport[0]).toHaveProperty('id');
    expect(data.workersReport[0]).toHaveProperty('code');
    expect(data.workersReport[0]).toHaveProperty('name');
    expect(data.workersReport[0]).toHaveProperty('surname');
    expect(data.workersReport[0]).toHaveProperty('operations');
  });

  test('Create worker', async () => {
    const worker = {
      code: faker.random.number(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
    };
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.createWorker,
      variables: {
        input: worker,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('createWorker');
    expect(data.createWorker).toHaveProperty('id');
    expect(data.createWorker).toHaveProperty('code');
    expect(data.createWorker).toHaveProperty('name');
    expect(data.createWorker).toHaveProperty('surname');
    expect(data.createWorker.code).toBe(worker.code);
    expect(data.createWorker.name).toBe(worker.name);
    expect(data.createWorker.surname).toBe(worker.surname);
    testWorkerId = data.createWorker.id;
    testWorker = {
      code: data.createWorker.code,
      name: data.createWorker.name,
      surname: data.createWorker.surname,
    };
  });

  test('User can not create worker', async () => {
    const worker = {
      code: faker.random.number(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
    };
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.userTokens,
      query: workers.createWorker,
      variables: {
        input: worker,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('createWorker');
    expect(data.createWorker).toBe(null);
    expect(errors[0].message).toBe('You must be an admin to do this');
  });

  test('Can not create worker with same code', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.createWorker,
      variables: {
        input: testWorker,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('createWorker');
    expect(data.createWorker).toBe(null);
    expect(errors[0].message).toBe('Validation error');
  });

  test('Update worker', async () => {
    const worker = {
      code: faker.random.number(),
      name: faker.name.firstName(),
      surname: faker.name.lastName(),
    };

    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.updateWorker,
      variables: {
        id: testWorkerId,
        input: worker,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateWorker');
    expect(data.updateWorker).toHaveProperty('id');
    expect(data.updateWorker).toHaveProperty('code');
    expect(data.updateWorker).toHaveProperty('name');
    expect(data.updateWorker).toHaveProperty('surname');
    expect(data.updateWorker.code).toBe(worker.code);
    expect(data.updateWorker.name).toBe(worker.name);
    expect(data.updateWorker.surname).toBe(worker.surname);
  });

  test('Remove worker', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.removeWorkers,
      variables: {
        ids: [testWorkerId],
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('removeWorkers');
    expect(data.removeWorkers).toHaveLength(1);
    expect(data.removeWorkers).toContain(testWorkerId);

    const getWorkersResponse = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: workers.getWorkers,
    });

    expect(getWorkersResponse.statusCode).toBe(200);
    expect(getWorkersResponse.body.data.workers).toHaveLength(workersCount);
  });
});
