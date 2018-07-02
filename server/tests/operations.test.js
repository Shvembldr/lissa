import faker from 'faker';
import app from '../app';
import { cards, operations, products } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';
import models, { sequelize } from '../models/index';
import randomFromArr from '../utils/randomFromArr';

describe('GraphQL Operations', () => {
  let tokens;
  let operationsIds;
  let workerCodes;
  beforeAll(async () => {
    tokens = await getTokens();
    const groups = await models.Group.findAll({ raw: true });
    const workers = await models.Worker.findAll({ raw: true });
    const customers = await models.Customer.findAll({ raw: true });
    workerCodes = workers.map(worker => worker.code);
    const operationCount = 10;
    const card = {
      vendorCode: faker.random.number(),
      groupId: groups[0].id,
    };
    const cardResponse = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.createCard,
      variables: {
        input: card,
        operationCount,
      },
    });

    const { operations } = cardResponse.body.data.createCard;

    operationsIds = operations.map(operation => operation.id);

    const product = {
      vendorCode: card.vendorCode,
      customerId: customers[0].id,
      size: faker.random.number(),
      count: faker.random.number(),
      date: faker.date.past().toISOString(),
    };

    await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: products.createProduct,
      variables: {
        input: product,
      },
    });
  });

  afterAll(async () => {
    sequelize.connectionManager.close();
  });

  test('Update operations for cards', async () => {
    const input = operationsIds.map(id => ({
      id,
      price: id * 10,
    }));
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: operations.updateOperations,
      variables: {
        input,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateOperations');
    expect(data.updateOperations[0]).toHaveProperty('id');
    expect(data.updateOperations[0]).toHaveProperty('code');
    expect(data.updateOperations[0]).toHaveProperty('price');
    expect(data.updateOperations[0]).toHaveProperty('card');
    expect(data.updateOperations[0]).toHaveProperty('product');

    data.updateOperations.forEach((operation, i) => {
      expect(operation.price).toBe(input[i].price);
    });
  });

  test('Update operations for products', async () => {
    const input = operationsIds.map(id => ({
      id,
      workerCode: randomFromArr(workerCodes),
    }));
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: operations.updateOperations,
      variables: {
        input,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateOperations');
    expect(data.updateOperations[0]).toHaveProperty('id');
    expect(data.updateOperations[0]).toHaveProperty('code');
    expect(data.updateOperations[0]).toHaveProperty('price');
    expect(data.updateOperations[0]).toHaveProperty('card');
    expect(data.updateOperations[0]).toHaveProperty('product');
    expect(data.updateOperations[0]).toHaveProperty('worker');

    data.updateOperations.forEach((operation, i) => {
      expect(operation.worker.code).toBe(input[i].workerCode);
    });
  });

  test('Can not set wrong worker', async () => {
    const input = operationsIds.map(id => ({
      id,
      workerCode: 992343940,
    }));
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: operations.updateOperations,
      variables: {
        input,
      },
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('updateOperations');
    expect(data.updateOperations).toBe(null);
    expect(errors[0].message).toBe('Wrong worker id');
  });
});
