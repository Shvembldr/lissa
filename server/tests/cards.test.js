import faker from 'faker';
import app from '../app';
import { cards } from './queries';
import { getTokens, makeGraphQlQuery } from './utils';
import { TABLE_ROW_COUNT } from '../../client/src/constants';
import models from '../models';

describe('GraphQL Cards', () => {
  let tokens;
  let testCardId;
  let testCardVendorCode;
  let cardsCount;
  let groupIdFirst;
  let groupIdSecond;
  const operationCount = 10;
  const variables = {
    limit: TABLE_ROW_COUNT,
    offset: 0,
    match: ''
  };
  beforeAll(async () => {
    tokens = await getTokens();
    const groups = await models.Group.findAll({ raw: true });
    groupIdFirst = groups[0].id;
    groupIdSecond = groups[1].id;
  });

  test('Get cards', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.getCards,
      variables
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('cards');
    expect(data.cards).toHaveProperty('count');
    expect(data.cards).toHaveProperty('rows');
    expect(data.cards.rows).toHaveLength(TABLE_ROW_COUNT);
    expect(data.cards.rows[0]).toHaveProperty('id');
    expect(data.cards.rows[0]).toHaveProperty('vendorCode');
    expect(data.cards.rows[0]).toHaveProperty('operations');
    expect(data.cards.rows[0]).toHaveProperty('group');
    cardsCount = data.cards.count;
  });

  test('Create card', async () => {
    const card = {
      vendorCode: faker.random.number(),
      groupId: groupIdFirst
    };
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.createCard,
      variables: {
        input: card,
        operationCount
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('createCard');
    expect(data.createCard).toHaveProperty('id');
    expect(data.createCard).toHaveProperty('vendorCode');
    expect(data.createCard).toHaveProperty('operations');
    expect(data.createCard).toHaveProperty('group');
    expect(data.createCard.operations).toHaveLength(operationCount);
    expect(data.createCard.vendorCode).toBe(card.vendorCode.toString());
    expect(data.createCard.group.id).toBe(card.groupId);
    testCardId = data.createCard.id;
    testCardVendorCode = data.createCard.vendorCode;
  });

  test('Can not create card with same vendorCode', async () => {
    const card = {
      vendorCode: testCardVendorCode,
      groupId: groupIdFirst
    };
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.createCard,
      variables: {
        input: card,
        operationCount
      }
    });

    expect(response.statusCode).toBe(200);

    const { data, errors } = response.body;
    expect(data).toHaveProperty('createCard');
    expect(data.createCard).toBe(null);
    expect(errors[0].message).toBe('Validation error');
  });

  test('Update card', async () => {
    const card = {
      vendorCode: faker.random.number(),
      groupId: groupIdSecond
    };

    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.updateCard,
      variables: {
        id: testCardId,
        input: card
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('updateCard');
    expect(data.updateCard).toHaveProperty('id');
    expect(data.updateCard).toHaveProperty('vendorCode');
    expect(data.updateCard).toHaveProperty('group');
    expect(data.updateCard.vendorCode).toBe(card.vendorCode.toString());
    expect(data.updateCard.group.id).toBe(card.groupId);
  });

  test('Remove card', async () => {
    const response = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.removeCards,
      variables: {
        ids: [testCardId]
      }
    });

    expect(response.statusCode).toBe(200);

    const { data } = response.body;
    expect(data).toHaveProperty('removeCards');
    expect(data.removeCards).toHaveLength(1);
    expect(data.removeCards).toContain(testCardId);

    const getCardsResponse = await makeGraphQlQuery({
      app,
      tokens: tokens.adminTokens,
      query: cards.getCards,
      variables
    });

    expect(getCardsResponse.statusCode).toBe(200);
    expect(getCardsResponse.body.data.cards.count).toBe(cardsCount);
  });
});
