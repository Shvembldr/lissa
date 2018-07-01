import faker from 'faker';
import app from '../app';
import { customers } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';

describe('GraphQL Customers', () => {
  let tokens;
  let testCustomerId;
  let testCustomerName;
  let customersCount;
  beforeAll(async () => {
    tokens = await getTokens();
  });

  test('Get customers', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: customers.getCustomers,
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('customers');
    expect(data.customers[0]).toHaveProperty('id');
    expect(data.customers[0]).toHaveProperty('name');
    customersCount = data.customers.length;
  });

  test('Create customer', async () => {
    const customerName = faker.random.word();
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: customers.createCustomer,
      variables: {
        input: {
          name: customerName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('createCustomer');
    expect(data.createCustomer).toHaveProperty('id');
    expect(data.createCustomer).toHaveProperty('name');
    expect(data.createCustomer.name).toBe(customerName);
    testCustomerId = data.createCustomer.id;
    testCustomerName = data.createCustomer.name;
  });

  test('Can not create same customer', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: customers.createCustomer,
      variables: {
        input: {
          name: testCustomerName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('createCustomer');
    expect(data.createCustomer).toBe(null);
    expect(errors[0].message).toBe('Validation error');
  });

  test('Update customer', async () => {
    const customerName = faker.random.word();
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: customers.updateCustomer,
      variables: {
        id: testCustomerId,
        input: {
          name: customerName,
        },
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateCustomer');
    expect(data.updateCustomer).toHaveProperty('id');
    expect(data.updateCustomer).toHaveProperty('name');
    expect(data.updateCustomer.name).toBe(customerName);
  });

  test('Remove customer', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: customers.removeCustomers,
      variables: {
        ids: [testCustomerId],
      },
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('removeCustomers');
    expect(data.removeCustomers).toHaveLength(1);
    expect(data.removeCustomers).toContain(testCustomerId);

    const getCustomersResponse = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: customers.getCustomers,
    });

    expect(getCustomersResponse.statusCode).toBe(200);
    expect(getCustomersResponse.body.data.customers).toHaveLength(customersCount);
  });
});
