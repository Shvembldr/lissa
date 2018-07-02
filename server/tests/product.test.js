import faker from 'faker';
import moment from 'moment';
import app from '../app';
import { products } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';
import { TABLE_ROW_COUNT } from '../../client/src/constants';
import models from '../models/index';

describe('GraphQL Products', () => {
  let tokens;
  let testProductId;
  // let productsCount;
  let customerIdFirst;
  let customerIdSecond;
  let cardFirst;
  let cardSecond;
  let cardFirstOperations;
  let cardSecondOperations;
  const now = new Date();
  const variables = {
    limit: TABLE_ROW_COUNT,
    offset: 0,
    match: ''
  };
  beforeAll(async () => {
    tokens = await getTokens();
    const customers = await models.Customer.findAll({ raw: true });
    const cards = await models.Card.findAll();
    cardFirst = cards[0].dataValues;
    cardFirstOperations = await cards[0].getOperations();
    cardSecond = cards[1].dataValues;
    cardSecondOperations = await cards[1].getOperations();
    customerIdFirst = customers[0].id;
    customerIdSecond = customers[1].id;
  });

  test('Get products', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: products.getProducts,
      variables
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('products');
    expect(data.products).toHaveProperty('count');
    expect(data.products).toHaveProperty('rows');
    expect(data.products.rows).toHaveLength(TABLE_ROW_COUNT);
    expect(data.products.rows[0]).toHaveProperty('id');
    expect(data.products.rows[0]).toHaveProperty('vendorCode');
    expect(data.products.rows[0]).toHaveProperty('customer');
    expect(data.products.rows[0]).toHaveProperty('operations');
    expect(data.products.rows[0]).toHaveProperty('group');
    expect(data.products.rows[0]).toHaveProperty('size');
    expect(data.products.rows[0]).toHaveProperty('count');
    expect(data.products.rows[0]).toHaveProperty('date');
    // productsCount = data.products.count;
  });

  test('Get products report', async () => {
    const startDate = moment(now).subtract(1, 'month');
    const endDate = moment(now);
    const dateRange = [startDate.toISOString(), endDate.toISOString()];
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: products.getProductsReport,
      variables: {
        dateRange
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('productsReport');
    expect(data.productsReport).toHaveProperty('report');
    expect(data.productsReport.report[0]).toHaveProperty('count');
    expect(data.productsReport.report[0]).toHaveProperty('vendorCode');
    expect(data.productsReport.report[0]).toHaveProperty('price');
    expect(data.productsReport.report[0]).toHaveProperty('sum');
  });

  test('Create product', async () => {
    const product = {
      vendorCode: cardFirst.vendorCode,
      customerId: customerIdFirst,
      size: faker.random.number(),
      count: faker.random.number(),
      date: faker.date.past().toISOString()
    };
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: products.createProduct,
      variables: {
        input: product
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('createProduct');
    expect(data.createProduct).toHaveProperty('id');
    expect(data.createProduct).toHaveProperty('vendorCode');
    expect(data.createProduct).toHaveProperty('customer');
    expect(data.createProduct).toHaveProperty('operations');
    expect(data.createProduct).toHaveProperty('group');
    expect(data.createProduct).toHaveProperty('size');
    expect(data.createProduct).toHaveProperty('count');
    expect(data.createProduct).toHaveProperty('date');
    expect(data.createProduct.operations).toHaveLength(cardFirstOperations.length);
    expect(data.createProduct.vendorCode).toBe(product.vendorCode.toString());
    expect(data.createProduct.customer.id).toBe(product.customerId);
    expect(data.createProduct.size).toBe(product.size);
    expect(data.createProduct.count).toBe(product.count);
    expect(new Date(data.createProduct.date).toDateString()).toBe(
      new Date(product.date).toDateString()
    );
    testProductId = data.createProduct.id;
  });

  test('Update product', async () => {
    const product = {
      vendorCode: cardSecond.vendorCode,
      customerId: customerIdSecond,
      size: faker.random.number(),
      count: faker.random.number(),
      date: faker.date.past().toISOString()
    };

    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: products.updateProduct,
      variables: {
        id: testProductId,
        input: product
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateProduct');
    expect(data.updateProduct).toHaveProperty('id');
    expect(data.updateProduct).toHaveProperty('vendorCode');
    expect(data.updateProduct).toHaveProperty('customer');
    expect(data.updateProduct).toHaveProperty('operations');
    expect(data.updateProduct).toHaveProperty('group');
    expect(data.updateProduct).toHaveProperty('size');
    expect(data.updateProduct).toHaveProperty('count');
    expect(data.updateProduct).toHaveProperty('date');
    expect(data.updateProduct.operations).toHaveLength(cardSecondOperations.length);
    expect(data.updateProduct.vendorCode).toBe(product.vendorCode.toString());
    expect(data.updateProduct.customer.id).toBe(product.customerId);
    expect(data.updateProduct.size).toBe(product.size);
    expect(data.updateProduct.count).toBe(product.count);
    expect(new Date(data.updateProduct.date).toDateString()).toBe(
      new Date(product.date).toDateString()
    );
  });

  test('Remove product', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: products.removeProducts,
      variables: {
        ids: [testProductId]
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('removeProducts');
    expect(data.removeProducts).toHaveLength(1);
    expect(data.removeProducts).toContain(testProductId);

    // const getProductsResponse = await makeGraphQlQuery({
    //   app,
    //   tokens: tokens.adminTokens,
    //   query: products.getProducts,
    //   variables,
    // });
    //
    // expect(getProductsResponse.statusCode).toBe(200);
    // expect(getProductsResponse.body.data.products.count).toBe(productsCount);
  });
});
